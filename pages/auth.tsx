import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

// this is the callback page that Kreative ID (public authentication part) will go to after a successful auth flow
// this means that this page is in charge of taking the key=XXX from the query parameters and creating a cookie with it
// as a result, no middleware will be on this page, instead this page will take the key, add a cookie, and then redirect to the admin page
// there, the admin page will have it's middleware go through the auth verification flow
export default function AuthPage() {
  const router = useRouter();
  const { key, inviteCode } = router.query;
  const [cookies, setCookie] = useCookies(["kreative_id_key"]); // skipcq

  useEffect(() => {
    const fetchUser = async () => {
      let requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/veterinarians/me`;

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Kreative-Id-Key": cookies.kreative_id_key,
        },
      });

      return response.json();
    };
    // nothing happens unless the key query param loads
    if (!key) return;
    // takes the given key and creates a new cookie, then redirects user to admin page
    // adds the cookie for the client side
    setCookie("kreative_id_key", key, {
      secure: process.env.NEXT_PUBLIC_ENV === "development" ? false : true,
      sameSite: "strict",
      path: "/",
    });

    if (cookies.kreative_id_key) {
      fetchUser().then((data) => {
        // if the user has not been added to a clinic in the users table
        // we then know they need to onboard
        if (data.veterinarian === null) {
          if (inviteCode) router.push(`/onboarding?inviteCode=${inviteCode}`);
          else router.push("/onboarding");
        } else if (!data.is_subscriber) {
          router.push("/dash/settings");
        } else {
          router.push("/dash/docustreams");
        }
      });
    }
    // redirects to the admin page for authentication flow to continue
  }, [key, setCookie, cookies, router, inviteCode]);

  return (
    <>
      <Head>
        <title>Authenticating | Kreative DocuVet</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="pt-6 text-center text-gray-400 px-6">
          We are signing you in... you should be redirected soon.
        </h1>
      </main>
    </>
  );
}
