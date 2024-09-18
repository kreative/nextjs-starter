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
import { AppStoreLogo, GooglePlayLogo } from "@phosphor-icons/react/dist/ssr";

export default function DownloadAppDialog({
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
          <DialogTitle>
            Download the DocuVet mobile app
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <DialogClose>
            <Button
              className="w-full flex items-center justify-center bg-brand-deepocean hover:bg-medicalblue-700"
              onClick={() => {
                window.open(
                  "https://apps.apple.com/us/app/kreative-docuvet/id6478257781",
                  "_blank"
                );
              }}
            >
              <AppStoreLogo className="w-6 h-6 mr-2 text-white" />
              iOS
            </Button>
          </DialogClose>
          <Button
            className="w-full flex items-center justify-center"
            onClick={() => {
              window.open(
                "https://play.google.com/store/apps/details?id=com.kreativeusa.docuvetapp&hl=en_US&pli=1",
                "_blank"
              );
            }}
          >
            <GooglePlayLogo className="w-6 h-6 mr-2 text-white" />
            Android
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
