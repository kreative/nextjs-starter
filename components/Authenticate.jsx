import wretch from "wretch";
import { useState, useMemo, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { userRolesStore } from "@/stores/userRoles";
import { intercomStore } from "@/stores/intercom";
import { UNAUTHORIZED_PAGE } from "../lib/constants";

// the identifier for kreative id, either test or prod version
const AIDN = process.env.NEXT_PUBLIC_AIDN;

// this component will serve as custom "middleware" to authenticate certain pages
// essentially, it will take all page components as children
// the function will run the authentication, and once it has passed will display children
// if the authentication fails, it will either handle it or redirect the user
export default function Authenticate({ children, permissions }) {
  // this sets default state to not authenticate so that the function won't render until useEffect has run
  const [authenticated, setAuthenticated] = useState(false);
  // the single cookie we need for this function, stores the key for the user
  const [cookies, setCookie, removeCookie] = useCookies([
    "kreative_id_key",
    "keychain_id",
  ]);
  // global state for the account data
  const [_account, setAccount] = useAtom(accountStore);
  const [userRoles, setUserRoles] = useAtom(userRolesStore);
  const [intercom, setIntercom] = useAtom(intercomStore);

  const testingInfo = useMemo(() => {
    if (process.env.NEXT_PUBLIC_ENV === "development") {
      return "&testing=true+local";
    } else if (process.env.NEXT_PUBLIC_ENV === "staging") {
      return "&testing=true+dev";
    } else {
      return "";
    }
  },[]);

  // in every Kreative application, this sort of function has to take place before
  // the actual business logic occurs, as there needs to be an authenticated user
  useEffect(() => {
    const authenticate = () => {
      console.log("authenticating");
      // gets cookies on the client side, if none are found, return false
      if (cookies.kreative_id_key === undefined) {
        // takes the user to the sign in page since there is no key
        console.log("no cookie found for key");
        window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}${testingInfo}`;
      } else {
        // gets the key from cookie and parses it as a string for the POST request
        const keyFromCookie = cookies.kreative_id_key;
        console.log("cookie found for key");

        // runs a verify keychain request on the API
        wretch("https://id-api.kreativeusa.com/v1/keychains/verify")
          .post({
            key: keyFromCookie,
            aidn: parseInt(AIDN),
          })
          .unauthorized((error) => {
            // unauthorized exception, meaning that the keychain is expired
            // relocates to signin page with the callback for 'Kreative ID Test'
            console.log(error);
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .forbidden((error) => {
            // aidn given is not the same as the one on the keychain
            // this is a weird error that would even happen, so we will just reauthenticate the user
            // relocates to signin page with the callback for 'Kreative ID Test'
            console.log(error);
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .internalError((error) => {
            // since there is something on the server side that isn't working reauthenticating wont work
            // instead we will redirect the user to an auth error page
            console.log(error);
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.comerror?cause=ise&aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .notFound((error) => {
            // the keychain does not exist, meaning that the user has never signed in
            // relocates to signin page with the callback for 'Kreative ID Test'
            console.log(error);
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .json((response) => {
            const account = response.data.account;
            const keychain = response.data.keychain;
            const userHash = response.data.docuvetIntercomHash;
            const roles = account.roles;
            // checks if the user has the same permissions as required by the application
            // in other Kreative applications this will have to be manually configured based on number of permissions

            let authorized = false;
            let rolesToSet = {
              isSubscribed: false,
              isAdmin: false,
              hasBase: false,
              isProvider: false,
            };

            roles.forEach((role) => {
              if (permissions[0] === role.rid) authorized = true;

              switch (role.rid) {
                case "DOCUVET_SUBSCRIBER":
                  rolesToSet.isSubscribed = true;
                  break;
                case "DOCUVET_ORG_ADMIN":
                  rolesToSet.isAdmin = true;
                  break;
                case "DOCUVET_BASE":
                  rolesToSet.hasBase = true;
                  break;
                case "DOCUVET_PROVIDER":
                  rolesToSet.isProvider = true;
                  break;
                case "DOCUVET_NONPROVIDER":
                  rolesToSet.isProvider = false;
                  break;
              }
            });

            setUserRoles(rolesToSet);
            setIntercom({ userHash });

            if (!authorized) {
              // user does not have the correct permissions to continue
              // we can't just say the user isn't authenticated, because they are, they just don't have the correct permissions
              // FOR NOW we will handle the error by redirecting the user to the error page with a query param for the error
              window.location.href = UNAUTHORIZED_PAGE;
            } else {
              // since we can't add headers, since we are executing this on the client side, we will just setup new cookies
              setCookie("keychain_id", keychain.id, {
                secure: true,
                sameSite: "strict",
                path: "/",
              });

              // we set the account data in the global state so that the application can access it anywhere
              setAccount(account);

              // send identify event to segment
              global?.analytics?.identify(account.ksn, {
                email: account.email,
                firstName: account.firstName,
                lastName: account.lastName,
                roles: account.roles,
              });

              // once all operations are completed, we set authenticated to true
              setAuthenticated(true);
            }
          })
          .catch((error) => {
            console.log(error);
            // some sort of unknown error, possibly on the client side itself
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://kreativedocuvet.com/500?cause=unknown&aidn=${AIDN}&message=${error.message}`;
          });
      }
    };

    authenticate();
  }, []); // TODO: fix this at some point

  return <div>{authenticated && <div>{children} </div>}</div>;
}
