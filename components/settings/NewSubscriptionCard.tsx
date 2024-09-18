import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import { getProviderCount } from "@/lib/users";
import { useQuery } from "@tanstack/react-query";
import TrialCardSkeleton from "@/components/onboarding/TrialCardSkeleton";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { createCheckoutSession } from "@/lib/stripe";

interface PriceDetailsProps {
  price: number;
  providers: number;
  frequency: "monthly" | "annual";
  cookie: string;
}

interface CheckItemProps {
  text: string;
}

function CheckItem(props: CheckItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Check weight="bold" className="text-brand-seafoam" size={20} />
      <p className="font-medium tracking-tight">{props.text}</p>
    </div>
  );
}

function PriceDetails(props: PriceDetailsProps) {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);
  const totalPrice = props.price * props.providers;
  const [account] = useAtom(accountStore);

  // create endDate using todays date + 14 days and make it human readable
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 14);
  const endDateString = endDate.toDateString();

  const handleButtonClick = async () => {
    setSpinner(true);
    let priceId: string;

    if (props.frequency === "monthly") {
      priceId = process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID!;
    } else {
      priceId = process.env.NEXT_PUBLIC_ANNUAL_PRICE_ID!;
    }

    const checkoutSession = {
      key: props.cookie,
      quantity: props.providers,
      email: account.email,
      priceId: priceId,
    };

    console.log(checkoutSession);

    const session = await createCheckoutSession(checkoutSession);

    window.location.href = session.redirect_url;
  };

  return (
    <div>
      <div className="flex items-end space-x-1">
        <h3 className="bg-gradient-to-r from-brand-seafoam to-brand-medicalblue inline-block text-transparent bg-clip-text text-6xl font-bold">{`$${props.price}`}</h3>
        {props.frequency === "monthly" && (
          <p className="text-neutrals-7 font-medium">per month</p>
        )}
        {props.frequency === "annual" && (
          <div className="flex space-x-2 items-center">
            <p className="text-neutrals-7 font-medium">per month</p>
            <span className="bg-brand-forrest px-2.5 py-0.5 text-white rounded-full text-[12px] font-medium italic">
              Save 25%
            </span>
          </div>
        )}
      </div>
      <div className="text-neutrals-8 mt-8 mb-4">
        {props.frequency === "monthly" && (
          <p>
            Your service will start today. Then, you&apos;ll be billed monthly
            at <span className="font-bold">${totalPrice}/month</span> for{" "}
            <span className="font-bold">{props.providers} provider(s)</span>.{" "}
            You can cancel at anytime, no questions asked.
          </p>
        )}
        {props.frequency === "annual" && (
          <p>
            Your service will start today. Then, you&apos;ll be billed annually
            at <span className="font-bold">${totalPrice * 12}/year</span> for{" "}
            <span className="font-bold">{props.providers} provider(s)</span>.{" "}
            You can cancel at anytime, no questions asked.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <CheckItem text="Priority support" />
        <CheckItem text="Full access to Kreative DocuVet" />
        <CheckItem text="Unlimited appointments" />
      </div>
      <div className="mt-8">
        <Button
          size="lg"
          className="w-full"
          onClick={handleButtonClick}
          animated
          fullWidth
        >
          {spinner ? (
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
              <span>One moment...</span>
            </div>
          ) : (
            <span>
              {"Continue with your " + props.frequency + " subscription"}
            </span>
          )}
        </Button>
        <p className="text-center text-neutrals-8 text-[12px] mt-3">
          By activating your subscription and completing your setup, you are
          agreeing to our{" "}
          <Link
            href="https://kreativedocuvet.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-deepocean font-medium hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="https://kreativedocuvet.com/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-deepocean font-medium hover:underline"
          >
            Terms of Use
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function NewSubscriptionCard() {
  const [cookies] = useCookies(["kreative_id_key"]);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["providers_count"],
    queryFn: async () => {
      return await getProviderCount({
        key: cookies.kreative_id_key,
      });
    },
  });

  if (isPending) {
    return <TrialCardSkeleton />;
  }

  if (isSuccess && data) {
    return (
      <div className="p-6 border-2 border-neutrals-4 rounded-xl bg-white">
        <Tabs defaultValue="annual" className="">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-neutrals-7">
                Subscribe to
              </p>
              <h2 className="text-xl font-bold tracking-tighter">
                Kreative DocuVet Pro
              </h2>
            </div>
            <div>
              <TabsList className="grid grid-cols-2 text-xs">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual</TabsTrigger>
              </TabsList>
            </div>
          </div>
          <TabsContent value="monthly">
            <PriceDetails
              price={199}
              providers={data?.providers_count}
              frequency="monthly"
              cookie={cookies.kreative_id_key}
            />
          </TabsContent>
          <TabsContent value="annual">
            <PriceDetails
              price={149}
              providers={data?.providers_count}
              frequency="annual"
              cookie={cookies.kreative_id_key}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
}
