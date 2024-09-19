import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { ArrowRight, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import useLogout from "@/hooks/useLogout";
import { SETTINGS_URL } from "@/lib/constants";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [account] = useAtom(accountStore);
  const { performLogout } = useLogout();

  function handleRefresh() {
    console.log("refreshing");
    router.back();
  }

  return (
    <div>
      <Navbar activeLink="docustreams" gradientType="regular" />
      <Container className="pt-24">
        <div className="border-neutrals-4 rounded-xl border bg-white p-12">
          <h1 className="text-4xl font-bold tracking-tight">
            You currently don&apos;t have access
          </h1>
          <p className="text-md text-neutrals-10 pt-6">
            You are logged in as {account?.email} and you do not have the
            required permissions to view that page. If you feel that something
            is wrong or that you should have access, please contact Kreative
            Support
          </p>
          <div className="flex items-center space-x-3">
            <Button
              variant={"default"}
              className="mt-6 flex items-center"
              onClick={handleRefresh}
              animated
            >
              Try refreshing
              <ArrowClockwise className="-mb-0.5 ml-2" weight="bold" />
            </Button>
            <Button
              variant={"default"}
              className="mt-6 flex items-center"
              onClick={performLogout}
              animated
            >
              Logout
            </Button>
            <Link href={SETTINGS_URL}>
              <Button
                variant={"secondary"}
                className="mt-6 flex items-center"
                animated
              >
                Go to settings
                <ArrowRight className="-mb-0.5 ml-2" weight="bold" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
