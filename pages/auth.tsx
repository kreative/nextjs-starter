import { BASE_PAGE_TITLE } from "@/lib/constants";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { accountStore } from "@/stores/account";
import { userRolesStore } from "@/stores/userRoles";
import { userStore } from "@/stores/user";
import { useAtom } from "jotai";
import useUsers from "@/hooks/useUsers";
import ICurrentUser from "@/types/ICurrentUser";
import { getRolesToSet } from "@/lib/utils";

// this is the callback page that Kreative ID (public authentication part) will go to after a successful auth flow
// this means that this page is in charge of taking the key=XXX from the query parameters and creating a cookie with it
// as a result, no middleware will be on this page, instead this page will take the key, add a cookie, and then redirect to the admin page
// there, the admin page will have it's middleware go through the auth verification flow
export default function AuthPage() {
  const router = useRouter();
  const { key, inviteCode } = router.query;
  const [cookies, setCookie] = useCookies(["kreative_id_key"]); // skipcq
  const { getCurrentUser } = useUsers();
  const [, setAccount] = useAtom(accountStore);
  const [, setUserRoles] = useAtom(userRolesStore);
  const [, setUser] = useAtom(userStore);

  useEffect(() => {
    const fetchUser = async () => {
      return await getCurrentUser();
    };

    if (!key) return;

    setCookie("kreative_id_key", key, {
      secure: process.env.NEXT_PUBLIC_ENV === "development" ? false : true,
      sameSite: "strict",
      path: "/",
    });

    if (cookies.kreative_id_key) {
      fetchUser().then((data: ICurrentUser) => {
        setAccount(data.account);
        setUserRoles(getRolesToSet(data.account.roles));
        setUser(data.user);
        // if the user has not been added to a clinic in the users table
        // we then know they need to onboard
        // if (data.veterinarian === null) {
        //   if (inviteCode) router.push(`/onboarding?inviteCode=${inviteCode}`);
        //   else router.push("/onboarding");
        // } else if (!data.is_subscriber) {
        //   router.push("/dash/settings");
        // } else {
        //   router.push("/dash/docustreams");
        // }

      });
      router.push("/")
    }
  }, [key, setCookie, cookies, router, inviteCode, getCurrentUser, setAccount, setUserRoles, setUser]);

  return (
    <>
      <Head>
        <title>Authenticating | {BASE_PAGE_TITLE}</title>
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
