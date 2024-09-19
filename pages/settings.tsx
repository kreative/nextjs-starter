import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs2";
import YourProfileContent from "@/components/settings/YourProfileContent";
import Footer from "@/components/Footer";

export default function Settings() {
  const [tab, setTab] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    if (router.query.tab) {
      setTab(router.query.tab as string);
    }
  }, [router]);

  return (
    <div>
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
            </TabsList>
          </Container>
        </div>
        <Container>
          <TabsContent value="profile" className="pb-16 pt-9">
            <YourProfileContent />
          </TabsContent>
        </Container>
      </Tabs>
      <Footer />
    </div>
  );
}
