import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Authenticate from "@/components/Authenticate";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { ArrowRight, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import useLogout from "@/hooks/useLogout";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [account] = useAtom(accountStore);
  const { performLogout } = useLogout();

  function handleRefresh() {
    console.log("refreshing");
    router.back();
  }

  return (
    <Authenticate permissions={["DOCUVET_BASE"]}>
      <Navbar activeLink="docustreams" gradientType="regular" />
      <Container className="pt-24">
        <div className="border-neutrals-4 rounded-xl border bg-white p-12">
          <h1 className="text-4xl font-bold tracking-tight">
            You currently don&apos;t have access
          </h1>
          <p className="text-md text-neutrals-10 pt-6">
            You are logged in as {account?.email} and you do not have the
            required permissions to view that page. If you feel that something
            is wrong or that you should have access, please contact your
            administrator. If you are an administrator, please contact us using
            Intercom in the bottom right corner. <br />
            <br />
            <span className="font-medium">
              You can also resume/renew your subscription in the settings page:
            </span>
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
            <Link href="/dash/settings?tab=billing">
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
    </Authenticate>
  );
}
