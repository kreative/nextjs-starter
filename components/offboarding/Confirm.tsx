import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";

interface ConfirmCancellationProps {
  setStep: (step: number) => void;
}

export default function ConfirmCancellation(props: ConfirmCancellationProps) {
  // const router = useRouter();
  // const [cookies] = useCookies(["kreative_id_key"]);
  // const [loading, setLoading] = useState(false);

  // const { isLoading, isSuccess, data } = useQuery({
  //   queryKey: ["subscription"],
  //   queryFn: async () => {
  //     const data = await getSubscription({
  //       key: cookies.kreative_id_key,
  //     });
  //     console.log(data);
  //     return data;
  //   },
  // });

  // function handleExit() {
  //   router.push("/dash/settings?tab=billing");
  // }

  // async function handleCancel() {
  //   console.log("cancelling...");
  //   cancelSubscription({
  //     key: cookies.kreative_id_key,
  //   }).then(() => {
  //     props.setStep(3);
  //   });
  // }

  // return (
  //   <div>
  //     <h1 className="text-3xl font-bold tracking-tight">
  //       Confirm your cancellation
  //     </h1>
  //     <p className="text-md text-neutrals-7 pb-6 pt-3 font-medium tracking-tight">
  //       <span className="text-brand-primary font-bold">
  //         Please confirm the details to below before cancelling.
  //       </span>{" "}
  //       If you have any questions or second thoughts, please reach out to us
  //       using Intercom in the bottom right corner.
  //     </p>
  //     {isLoading && <SubscriptionCardSkeleton />}
  //     {isSuccess && data && (
  //       <SubscriptionCard
  //         plan_type={data.plan_type}
  //         price={data.price}
  //         quantity={data.quantity}
  //         status={data.status}
  //         daysLeft={data.daysLeft}
  //         trialEndHuman={data.trialEndHuman}
  //         periodEndHuman={data.periodEndHuman}
  //         duringCancellation
  //       />
  //     )}
  //     <div className="flex items-center justify-end space-x-3 pt-12">
  //       <Button variant={"ghost"} disabled={!isSuccess} onClick={handleCancel}>
  //         {loading ? (
  //           <div className="flex items-center justify-center space-x-3">
  //             <motion.span
  //               className="border-t-brand-forrest flex h-5 w-5 items-center rounded-full border-2 border-white"
  //               animate={{ rotate: 360 }}
  //               transition={{
  //                 duration: 1,
  //                 repeat: Infinity,
  //                 ease: "linear",
  //               }}
  //               role="status"
  //             />
  //             <span>Cancelling...</span>
  //           </div>
  //         ) : (
  //           <span className="flex items-center space-x-2">
  //             Yes, cancel my plan
  //           </span>
  //         )}
  //       </Button>
  //       <Button onClick={handleExit}>No, take me back</Button>
  //     </div>
  //   </div>
  // );

  return <div>Confirm</div>;
}
