import { useCookies } from "react-cookie";
import axios from "axios";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import IAccount from "@/types/IAccount";
import { LOGOUT_CONFIRMATION_PAGE } from "@/lib/constants";

function useLogout() {
  const AIDN = process.env.NEXT_PUBLIC_AIDN!;
  const [account, setAccount] = useAtom(accountStore);
  // gets the cookies from local storage
  const [cookies, setCookie, removeCookie] = useCookies([
    "kreative_id_key",
    "keychain_id",
  ]);

  const performLogout = async () => {
    axios
      .post(
        `https://id-api.kreativeusa.com/v1/keychains/close`,
        {
          key: cookies.kreative_id_key,
        },
        {
          headers: {
            KREATIVE_ID_KEY: cookies.kreative_id_key,
            KREATIVE_AIDN: process.env.NEXT_PUBLIC_AIDN,
          },
        }
      )
      .then((response) => {
        // check if response is between 200 and 299
        if (response.status >= 200 && response.status <= 299) {
          // deletes all cookies stored in local storage
          removeCookie("kreative_id_key", { path: "/" });
          removeCookie("keychain_id", { path: "/" });

          // resets the global account data store
          setAccount({} as IAccount);

          // redirects the user to the logout confirmation page
          window.location.href = LOGOUT_CONFIRMATION_PAGE;
        }
      })
      .catch((error) => {
        // error response status code is above 300+
        console.log(error);

        // gets the status code of the error through the response
        // we check to see if the status code exists as to not throw an error in case an error is thrown
        // that isn't actually sent by the server api, but rather from axios
        let statusCode;

        if (error.response.data.statusCode === undefined) {
          statusCode = error.response.data.statusCode;

          // for all of these errors we want to redirect the user to the error page with a cause
          if (statusCode === 403) {
            // bad request, probably the id was not passed or is not a number
            window.location.href = `https://id.kreativeusa.com/error?cause=badrequest&aidn=${AIDN}`;
          } else if (statusCode === 404) {
            // keychain not found using the id
            window.location.href = `https://id.kreativeusa.com/error?cause=notfound&aidn=${AIDN}`;
          } else if (statusCode === 500) {
            // internal server error
            window.location.href = `https://id.kreativeusa.com/error?cause=ise&aidn=${AIDN}`;
          } else {
            // some weird unknown error
            // this should not happen at all, so if it does there are critical issues
            window.location.href = `https://id.kreativeusa.com/error?cause=unknown&aidn=${AIDN}`;
          }
        } else {
          // if there is no error response status code then we have an "unknown error"
          // in most cases this is a connection error or some sort of axios error
          window.location.href = `https://id.kreativeusa.com/error?cause=unknown&aidn=${AIDN}`;
        }
      });
  };

  return { performLogout };
}

export default useLogout;
