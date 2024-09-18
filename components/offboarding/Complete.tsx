import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";

export default function Complete() {
  const { performLogout } = useLogout();

  return (
    <div className="flex flex-col items-center text-center max-w-full sm:max-w-[65%] ml-0 mt-0 sm:ml-16 sm:-mt-8">
      <SealCheck className="text-brand-seafoam mb-6" size={100} />
      <h1 className="text-3xl font-bold tracking-tight">
        You have successfully cancelled your subscription to Kreative DocuVet.
      </h1>
      <p className="text-md text-neutrals-7 pb-6 pt-3 font-medium tracking-tight">
        We hope to earn your business in the future again. If you have any
        questions or need assistance, please reach out to us using Intercom in
        the bottom right corner.
      </p>
      <Button
        className="w-full text-md h-11"
        onClick={performLogout}
        size="default"
        animated
        fullWidth
      >
        Logout 👋
      </Button>
    </div>
  );
}
