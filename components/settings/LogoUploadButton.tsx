import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCookies } from "react-cookie";
import { FileUploader } from "@/components/file-uploader";
import { updateLogo } from "@/lib/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export default function LogoUploadButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [files, setFiles] = React.useState<File[]>([]);
  const [newFileUrl, setNewFileUrl] = React.useState<string | null>(null);
  const [cookies] = useCookies(["kreative_id_key"]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<"uploading" | "done">("uploading");

  const updateLogoMutation = useMutation({
    mutationFn: async () =>
      await updateLogo({ key: cookies.kreative_id_key, file: files[0] }),
    onSuccess: async (data) => {
      setNewFileUrl(data.file_url);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setStage("done");
    },
  });

  const clear = async () => {
    setFiles([]);
    setStage("uploading");
    setErrorMessage(null);
  };

  return (
    <Dialog
      onOpenChange={async (isOpen) => {
        if (!isOpen) await clear();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="bg-neutrals-3"
      >
        {stage === "uploading" && (
          <div>
            <DialogHeader className="pb-3">
              <DialogTitle>Add new logo</DialogTitle>
              <DialogDescription className="font-medium">
                You can only upload one file for your new logo.{" "}
                {errorMessage && (
                  <span className="text-red-500 font-bold mt-2">
                    {errorMessage}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <FileUploader
              value={files}
              maxFiles={1}
              maxSize={10 * 1024 * 1024 * 1024}
              onValueChange={setFiles}
              multiple={true}
              accept={{ "image/**": ["image/png", "image/jpeg", "image/jpg"] }}
            />
            {files.length > 0 && (
              <Button
                animated
                fullWidth
                animatedSize="grow"
                className="w-full mt-5"
                disabled={updateLogoMutation.isPending}
                onClick={async () => {
                  await updateLogoMutation.mutate();
                }}
              >
                {updateLogoMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="small" className="text-white" />
                    <span className="ml-2">Uploading...</span>
                  </div>
                ) : (
                  "Upload and set as new logo"
                )}
              </Button>
            )}
          </div>
        )}
        {stage === "done" && (
          <div>
            <DialogHeader>
              <DialogTitle>Custom Logo for PDFs Updated!</DialogTitle>
              <DialogDescription>
                This logo will now be displayed on the top left of the first
                page on PDF exported notes.
              </DialogDescription>
            </DialogHeader>
            <Image
              src={newFileUrl!}
              width={700}
              height={700}
              alt="Logo"
              className="w-full h-auto py-2"
            />
            <DialogFooter>
              <DialogClose>
                <Button variant="secondary" fullWidth>
                  Go back
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
