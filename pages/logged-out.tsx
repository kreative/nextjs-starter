import Head from "next/head";
import { Button } from "@/components/ui/button";
import { BASE_PAGE_TITLE, LOGIN_URL } from "@/lib/constants";

export default function LoggedOut() {
  return (
    <>
      <Head>
        <title>Logged out | {BASE_PAGE_TITLE}</title>
        <meta
          name="description"
          content="First-class authentication for Kreative."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="pt-12 pb-3 text-center text-2xl">
          You have been logged out!
        </h1>
        <div className="flex items-center justify-center pt-6">
          <Button
            variant="default"
            onClick={() => {
              window.location.href = LOGIN_URL;
            }}
          >
            Log back in
          </Button>
        </div>
      </main>
    </>
  );
}
