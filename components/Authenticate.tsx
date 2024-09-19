import wretch from "wretch";
import { useState, useMemo, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { IUserRolesStore, userRolesStore } from "@/stores/userRoles";
import { BASE_ROLE, UNAUTHORIZED_PAGE, UNKNOWN_ERROR_REDIRECT_URL } from "@/lib/constants";
import IAccountRole from "@/types/IAccountRole";

// this component will serve as custom "middleware" to authenticate certain pages
// essentially, it will take all page components as children
// the function will run the authentication, and once it has passed will display children
// if the authentication fails, it will either handle it or redirect the user
interface AuthenticateProps {
  children: React.ReactNode;
  permissions: string[];
}

export default function Authenticate({ children, permissions }: AuthenticateProps) {
  const AIDN = process.env.NEXT_PUBLIC_AIDN!;
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
      // gets cookies on the client side, if none are found, return false
      if (cookies.kreative_id_key === undefined) {
        // takes the user to the sign in page since there is no key
        window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}${testingInfo}`;
      } else {
        // gets the key from cookie and parses it as a string for the POST request
        const keyFromCookie = cookies.kreative_id_key;

        // runs a verify keychain request on the API
        wretch("https://id-api.kreativeusa.com/v1/keychains/verify")
          .post({
            key: keyFromCookie,
            aidn: parseInt(AIDN),
          })
          .unauthorized((error) => {
            // unauthorized exception, meaning that the keychain is expired
            // relocates to signin page with the callback for 'Kreative ID Test'
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .forbidden((error) => {
            // aidn given is not the same as the one on the keychain
            // this is a weird error that would even happen, so we will just reauthenticate the user
            // relocates to signin page with the callback for 'Kreative ID Test'
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .internalError((error) => {
            // since there is something on the server side that isn't working reauthenticating wont work
            // instead we will redirect the user to an auth error page
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.comerror?cause=ise&aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .notFound((error) => {
            // the keychain does not exist, meaning that the user has never signed in
            // relocates to signin page with the callback for 'Kreative ID Test'
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `https://id.kreativeusa.com/signin?aidn=${AIDN}&message=${error.message}${testingInfo}`;
          })
          .json((response) => {
            const account = response.data.account;
            const keychain = response.data.keychain;
            const roles = account.roles;
            // checks if the user has the same permissions as required by the application
            // in other Kreative applications this will have to be manually configured based on number of permissions

            let authorized = false;
            let rolesToSet: IUserRolesStore = { hasBase: false };

            roles.forEach((role: IAccountRole) => {
              if (permissions[0] === role.rid) authorized = true;

              switch (role.rid) {
                case BASE_ROLE:
                  rolesToSet.hasBase = true;
                  break;
              }
            });

            setUserRoles(rolesToSet);

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
              // global?.analytics?.identify(account.ksn, {
              //   email: account.email,
              //   firstName: account.firstName,
              //   lastName: account.lastName,
              //   roles: account.roles,
              // });

              // once all operations are completed, we set authenticated to true
              setAuthenticated(true);
            }
          })
          .catch((error) => {
            // some sort of unknown error, possibly on the client side itself
            removeCookie("kreative_id_key");
            removeCookie("keychain_id");
            window.location.href = `${UNKNOWN_ERROR_REDIRECT_URL}?cause=unknown&aidn=${AIDN}&message=${error.message}`;
          });
      }
    };

    authenticate();
  }, [cookies.kreative_id_key, permissions, removeCookie, setAccount, setCookie, setUserRoles, testingInfo]);

  return <div>{authenticated && <div>{children}</div>}</div>;
}
