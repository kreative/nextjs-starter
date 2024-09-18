import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Authenticate from "@/components/Authenticate";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs2";
import YourProfileContent from "@/components/settings/YourProfileContent";
import DocumentsContent from "@/components/settings/documents/DocumentsContent";
import ClinicContent from "@/components/settings/ClinicContent";
import BillingContent from "@/components/settings/BillingContent";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { userRolesStore } from "@/stores/userRoles";

export default function Settings() {
  const [account] = useAtom(accountStore);
  const [userRoles] = useAtom(userRolesStore);
  const [tab, setTab] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    if (router.query.tab) {
      setTab(router.query.tab as string);
    }
  }, [router]);

  return (
    <Authenticate permissions={["DOCUVET_BASE"]}>
      <Navbar activeLink="settings" gradientType="regular" />
      <Container>
        <h1 className="pt-24 text-3xl font-bold tracking-tight px-4 min-[840px]:px-0">
          Settings
        </h1>
      </Container>
      <Tabs defaultValue={tab} className="block w-full">
        <div className="w-full border-b-2 border-b-black/10 pt-0">
          <Container>
            <TabsList className="space-x-4 pt-6 px-4 min-[840px]:px-0">
              <TabsTrigger value="profile">Account</TabsTrigger>
              <TabsTrigger value="clinic">Clinic</TabsTrigger>
              <TabsTrigger value="notes">Documents</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
          </Container>
        </div>
        <Container>
          <TabsContent value="profile" className="pb-16 pt-9">
            <YourProfileContent />
          </TabsContent>
          <TabsContent value="clinic" className="pb-16 pt-9">
            <ClinicContent
              isAdmin={userRoles.isAdmin}
              isSubscribed={userRoles.isSubscribed}
            />
          </TabsContent>
          <TabsContent value="notes" className="pb-16 pt-9">
            <DocumentsContent />
          </TabsContent>
          <TabsContent value="billing" className="pb-16 pt-9">
            <BillingContent
              isAdmin={userRoles.isAdmin}
              isSubscribed={userRoles.isSubscribed}
              userEmail={account.email}
            />
          </TabsContent>
        </Container>
      </Tabs>
    </Authenticate>
  );
}
