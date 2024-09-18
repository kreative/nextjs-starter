import { useRouter } from "next/router";
import Navbar from "@/components/onboarding/Navbar";
import Authenticate from "@/components/Authenticate";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function SubscriptionCreated() {
  const router = useRouter();

  return (
    <div className="background-gradient-3">
      <Authenticate permissions={["DOCUVET_BASE"]}>
        <Navbar />
        <Container>
          <main className={`flex min-h-[80vh] items-center justify-center`}>
            <div className="bg-white/80 rounded-2xl w-full p-12 shadow-lg">
              <div className="mb-4">
                <span className="text-brand-forrest px-4 py-[6px] rounded-full border border-brand-forrest">
                  You&apos;re subscription has started!
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter py-6">
                Welcome to the joyful future of{" "}
                <span className="line-through decoration-wavy decoration-red-500">
                  writing
                </span>{" "}
                medical records. We&apos;re excited you&apos;re here! 😊🫶
              </h1>
              <p className="text-md text-black/80 pb-3">
                We&apos;re excited to have you on board and can&apos;t wait to
                see how you use our platform to dramatically cut time spent on
                medical records and get home on time.
              </p>
              <p className="text-md text-black font-medium mb-6">
                We built Kreative DocuVet for YOU, and we would love to hear
                from you. If you have any questions, product feedback, or just
                want to talk, you can reach our team through Intercome in the
                bottom right corner of the screen or on our{" "}
                <a
                  href="https://kreativedocuvet.com"
                  className="underline text-brand-forrest hover:font-bold"
                >
                  website here.
                </a>
              </p>
              {/* VIDEO WILL GO HERE */}
              <Button
                size="lg"
                className="w-full flex items-center text-md"
                onClick={() => router.push("/dash/docustreams")}
                animated
              >
                Start your journey
                <ArrowRight size={20} weight="bold" className="ml-2 -mb-1" />
              </Button>
            </div>
          </main>
        </Container>
      </Authenticate>
    </div>
  );
}
