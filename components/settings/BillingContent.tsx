import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionDivider from "../SectionDivider";
import { ArrowLineUpRight } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { getSubscription, createCustomerPortalSession } from "@/lib/stripe";
import { useCookies } from "react-cookie";
import SubscriptionCard from "@/components/settings/SubscriptionCard";
import { SubscriptionCardSkeleton } from "@/components/settings/SettingsSkeleton";
import NewSubscriptionCard from "@/components/settings/NewSubscriptionCard";
import { motion } from "framer-motion";

interface BillingContentProps {
  isAdmin: boolean;
  isSubscribed: boolean;
  userEmail: string;
}

export default function BillingContent(props: BillingContentProps) {
  const [cookies] = useCookies(["kreative_id_key"]);
  const [spinning, setSpinning] = useState(false);

  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const data = await getSubscription({
        key: cookies.kreative_id_key,
      });
      console.log(data);
      return data;
    },
  });

  async function handleGoToStripe() {
    setSpinning(true);
    const session = await createCustomerPortalSession({
      key: cookies.kreative_id_key,
    });
    window.location.href = session.url;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h2 className="pb-2 text-2xl font-bold tracking-tight">
            Your subscription
          </h2>
          <p className="text-neutrals-10 text-md tracking-tight">
            These are your active subscriptions and will all be billed in the
            same billing cycle for your clinic. You can update or cancel your
            subscription at any time.
          </p>
        </div>
        <div className="col-span-2">
          {isPending && <SubscriptionCardSkeleton />}
          {isSuccess && data && data.status !== "canceled" && (
            <SubscriptionCard
              plan_type={data.plan_type}
              price={data.price}
              quantity={data.quantity}
              status={data.status}
              daysLeft={data.daysLeft}
              trialEndHuman={data.trialEndHuman}
              periodEndHuman={data.periodEndHuman}
              isAdmin={props.isAdmin}
            />
          )}
          {isSuccess && data && data.status === "canceled" && (
            <NewSubscriptionCard />
          )}
          {isSuccess && !data && <div>Not found</div>}
        </div>
      </div>
      <SectionDivider />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
        <div className="col-span-2">
          <h2 className="pb-2 text-2xl font-bold tracking-tight">
            Manage your subscription
          </h2>
          <p className="text-md text-neutrals-10 mb-6 tracking-tight">
            We leverage Stripe&apos;s enterprise-ready and trusted platform to
            manage our customer&apos;s billing information and subscriptions.
            You can manage that information on Stripe.
          </p>
          <div className="flex justify-start gap-3">
            <Button
              variant="default"
              className="flex items-center justify-center"
              onClick={handleGoToStripe}
              disabled={!props.isAdmin}
              animated
            >
              {spinning ? (
                <div className="flex justify-center items-center space-x-3">
                  <motion.span
                    className="flex items-center w-5 h-5 border-2 border-white border-t-brand-forrest rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    role="status"
                  />
                  <span>Launching Stripe</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  Manage with Stripe
                  <ArrowLineUpRight
                    weight="bold"
                    className="-mb-0.5 ml-2 h-4 w-4"
                  />
                </div>
              )}
            </Button>
            <Link
              href="/cancel-plan"
              className={props.isSubscribed ? "block" : "hidden"}
            >
              <Button
                variant="secondary"
                className="flex items-center justify-center"
                disabled={!props.isAdmin}
                animated
              >
                Cancel your plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
