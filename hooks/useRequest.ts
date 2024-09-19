import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { SIGNIN_URL } from "@/lib/constants";

function useRequest() {
  const AIDN = process.env.NEXT_PUBLIC_AIDN!;
  const ENV = process.env.NEXT_PUBLIC_ENV!;
  const router = useRouter();
  const [cookies, _, removeCookie] = useCookies([
    "kreative_id_key",
    "keychain_id",
  ]);

  const makeRequest = async (
    method: string,
    url: string,
    body?: any
  ): Promise<any> => {
    let testingInfo = "";

    if (ENV === "development") testingInfo = "&testing=true+local";
    else if (ENV === "staging") testingInfo = "&testing=true+dev";

    const KREATIVE_ID_URL = `${SIGNIN_URL}?aidn=${AIDN}${testingInfo}`;

    if (cookies.kreative_id_key === undefined || cookies.kreative_id_key === null) {
      router.push(KREATIVE_ID_URL);
    }

    const key = cookies.kreative_id_key;

    // Set up request headers with "Kreative-Id-Key"
    const headers: HeadersInit = {
      "Kreative-Id-Key": key,
    };

    // Include 'Content-Type' if body is provided and is an object
    if (body && typeof body === "object" && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Set up request options
    const options: RequestInit = {
      method,
      headers,
    };

    // Include the body if provided
    if (body) {
      if (typeof body === "object" && !(body instanceof FormData)) {
        options.body = JSON.stringify(body);
      } else {
        options.body = body;
      }
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let errorData;

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }

        let errorMessage = `HTTP error! status: ${response.status}`;

        switch (response.status) {
          case 401:
            // this means that the user does not have a valid key
            errorMessage = "Unauthorized";
            removeCookie("keychain_id");
            removeCookie("kreative_id_key");
            router.push(KREATIVE_ID_URL + `&message=${errorData}`);
            break;
          case 403:
            // this means that the user does not have the right roles
            errorMessage = "Forbidden";
            break;
          case 400:
            errorMessage = "Bad Request";
            break;
          case 404:
            errorMessage = "Not Found";
            break;
          case 500:
            errorMessage = "Internal Server Error";
            break;
          default:
            errorMessage = `HTTP error! status: ${response.status}`;
            break;
        }

        // Create an error object with status and message
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Parse and return the response data
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
        const data = await response.text();
        return data;
      }
    } catch (error) {
      // Handle network errors or unexpected exceptions
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return { makeRequest };
}

export default useRequest;
