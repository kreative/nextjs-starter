import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createCustomerPortalSession } from "@/lib/stripe";
import { useCookies } from "react-cookie";

interface SubscriptionCardProps {
  plan_type: string;
  price: number;
  quantity: number;
  status: string;
  daysLeft?: number;
  trialEndHuman?: string;
  periodEndHuman?: string;
  duringCancellation?: boolean;
  isAdmin?: boolean;
}

// possible status codes: incomplete, incomplete_expired, trialing, active, past_due, canceled, paused, or unpaid
function SubscriptionPill(props: { status: string; plan_type: string }) {
  if (props.status === "active") {
    return (
      <span className="text-[10px] py-1 px-4 rounded-full bg-seafoam-100 text-seafoam-900 font-bold">
        {props.plan_type === "monthly" ? "MONTHLY" : "ANNUAL"}
      </span>
    );
  } else if (props.status === "trialing") {
    return (
      <span className="text-[10px] py-1 px-4 rounded-full bg-medicalblue-50 text-brand-medicalblue font-bold">
        IN TRIAL
      </span>
    );
  } else if (props.status === "past_due" || props.status === "unpaid") {
    return (
      <span className="text-[10px] py-1 px-4 rounded-full bg-red-100 text-red-900 font-bold">
        {props.status.toUpperCase().replace("_", " ")}
      </span>
    );
  } else if (props.status === "paused") {
    return (
      <span className="text-[10px] py-1 px-4 rounded-full bg-red-100 text-red-900 font-bold">
        {props.status.toUpperCase().replace("_", " ")}
      </span>
    );
  } else {
    return (
      <span className="text-[10px] py-1 px-4 rounded-full bg-neutrals-3 text-neutrals-13 font-bold">
        INCOMPLETE
      </span>
    );
  }
}

export default function SubscriptionCard(props: SubscriptionCardProps) {
  const [cookies] = useCookies(["kreative_id_key"]);

  async function handlePausedSubscription() {
    const session = await createCustomerPortalSession({
      key: cookies.kreative_id_key,
    });
    window.location.href = session.url;
  }

  return (
    <div className="p-6 border-2 border-neutrals-4 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex justify-start items-center space-x-2">
          <Image
            src="https://res.cloudinary.com/dlazo25rt/image/upload/v1708364309/kreativedocuvet.com/docuvet-app-icon-big_lubnm3.png"
            width={28}
            height={28}
            alt="Kreative DocuVet app icon in hybrid colorway "
          />
          <h3 className="text-xl font-bold tracking-tight">
            DocuVet Pro
          </h3>
        </div>
        <SubscriptionPill status={props.status} plan_type={props.plan_type} />
      </div>
      {props.status === "active" && !props.duringCancellation && (
        <p className="text-sm text-neutrals-10">
          {`Your subscription is billed ${props.plan_type} at `}
          <span className="font-bold">{`$${props.price * props.quantity}/${
            props.plan_type === "monthly" ? "month" : "year"
          } `}</span>
          for{" "}
          <span className="font-bold">{`${props.quantity} provider(s). `}</span>
          <span className="text-sm text-neutrals-10">
            Your next billing date is{" "}
            <span className="font-bold">{props.periodEndHuman}.</span>
          </span>
        </p>
      )}
      {props.status === "active" && props.duringCancellation && (
        <p className="text-lg text-neutrals-10">
          {`Your current subscription you are about to cancel is billed ${props.plan_type} at `}
          <span className="font-bold">{`$${props.price * props.quantity}/${
            props.plan_type === "monthly" ? "month" : "year"
          } `}</span>
          for{" "}
          <span className="font-bold">{`${props.quantity} provider(s). `}</span>
          <span className="text-lg text-neutrals-10">
            Even after you cancel, your service will be active until your
            current billing period end date at{" "}
            <span className="font-bold">{props.periodEndHuman}.</span>
          </span>
        </p>
      )}
      {props.status === "paused" && (
        <div>
          <p className="text-md text-neutrals-10 pb-3">
            You&apos;re free trial has ended and your subscription has been
            paused since no payment method has been added before the trial end
            date. If you&apos;d like to reactivate your service, please add a
            payment method.
          </p>
          <Button
            size="default"
            className="w-full"
            onClick={handlePausedSubscription}
            disabled={!props.isAdmin}
            animated
          >
            Add a payment method
          </Button>
        </div>
      )}
      {props.status === "trialing" && (
        <p className="text-sm text-neutrals-10">
          <span className="">You have</span>
          <span className="font-bold">{` ${props.daysLeft} days left `}</span>
          <span>on your free trial which will end on</span>
          <span className="font-bold">{` ${props.trialEndHuman}`}</span>
          {` After that, you will be billed ${props.plan_type} at `}
          <span className="font-bold">{`$${props.price * props.quantity}/${
            props.plan_type === "monthly" ? "month" : "year"
          } `}</span>
          for{" "}
          <span className="font-bold">{`${props.quantity} provider(s).`}</span>
        </p>
      )}
    </div>
  );
}
