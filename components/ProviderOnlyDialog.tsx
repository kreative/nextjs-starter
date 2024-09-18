import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProviderOnlyDialog({
  children,
  message,
}: {
  children: React.ReactNode;
  message: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This is a Provider-only feature</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <DialogClose>
            <Button className="w-full" variant={"secondary"}>Got it</Button>
          </DialogClose>
          <Button
            onClick={() => {
              window.open("https://support.kreativeusa.com/docuvet", "_blank");
            }}
          >
            Get Kreative Support
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
