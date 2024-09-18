import * as React from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { useCookies } from "react-cookie";
import { FileUploader } from "@/components/file-uploader";
import { createDocuStream } from "@/lib/docustreams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { getTotalAudioDuration } from "@/lib/utils";
import { uploadAudioForDocustream } from "@/lib/audio";

export default function AudioUploadButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [files, setFiles] = React.useState<File[]>([]);
  const [cookies] = useCookies(["kreative_id_key"]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<"uploading" | "done">("uploading");

  const createDocustreamMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await createDocuStream({
        key,
        startTime: new Date().toUTCString(),
      });

      const docustream = response.docustream;

      let totalDuration = await getTotalAudioDuration(files);
      if (!totalDuration || totalDuration === Infinity) totalDuration = 0;

      await uploadAudioForDocustream({
        key: cookies.kreative_id_key,
        docustreamId: docustream.id,
        files,
        length: totalDuration,
      });

      return response.docustream;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["docustreams"] });
      setStage("done");
    },
  });

  const createDocustream = async () => {
    // check if all files have the same format
    const formats = new Set();

    for (const file of files) {
      formats.add(file.type);
    }

    if (formats.size > 1) {
      setErrorMessage("All files must have the same format. Please try again.");
      return;
    }

    setErrorMessage(null);
    const key = cookies.kreative_id_key;
    await createDocustreamMutation.mutateAsync(key);
  };

  const clear = async () => {
    setFiles([]);
    setStage("uploading");
    setErrorMessage(null);
  };

  return (
    <div>
      <div className="hidden sm:block">
        <Dialog
          onOpenChange={async (isOpen) => {
            if (!isOpen) {
              await clear();
            }
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
                  <DialogTitle>Add audio files</DialogTitle>
                  <DialogDescription className="font-medium">
                    You can only upload files that have the same audio file
                    format.{" "}
                    {errorMessage && (
                      <span className="text-red-500 font-bold mt-2">
                        {errorMessage}
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <FileUploader
                  value={files}
                  maxFiles={24}
                  maxSize={10 * 1024 * 1024 * 1024}
                  onValueChange={setFiles}
                  multiple={true}
                />
                {files.length > 0 && (
                  <Button
                    animated
                    fullWidth
                    animatedSize="grow"
                    className="w-full mt-5"
                    disabled={createDocustreamMutation.isPending}
                    onClick={async () => {
                      await createDocustream();
                    }}
                  >
                    {createDocustreamMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <Spinner size="small" className="text-white" />
                        <span className="ml-2">Creating Docustream...</span>
                      </div>
                    ) : (
                      "Upload and create Docustream"
                    )}
                  </Button>
                )}
              </div>
            )}
            {stage === "done" && (
              <div>
                <DialogHeader>
                  <DialogTitle>Your notes are generating 🔥</DialogTitle>
                  <DialogDescription className="pb-4">
                    You will have your transcript and default document in less
                    than a minute.
                  </DialogDescription>
                  <DialogFooter className="grid grid-cols-2 gap-2 pt-4">
                    <DialogClose>
                      <Button
                        variant="secondary"
                        className="w-full hover:bg-neutrals-5/70"
                      >
                        Close this dialog
                      </Button>
                    </DialogClose>
                    <Button onClick={async () => await clear()}>
                      Upload more audio
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="block sm:hidden">
        <Drawer
          onOpenChange={async (isOpen) => {
            if (!isOpen) {
              await clear();
            }
          }}
        >
          <DrawerTrigger asChild>{children}</DrawerTrigger>
          <DrawerContent
            onInteractOutside={(e) => e.preventDefault()}
            className="bg-neutrals-3"
          >
            {stage === "uploading" && (
              <div>
                <DrawerHeader className="pb-3">
                  <DrawerTitle>Add audio files</DrawerTitle>
                  <DrawerDescription className="font-medium">
                    You can only upload files that have the same audio file
                    format.{" "}
                    {errorMessage && (
                      <span className="text-red-500 font-bold mt-2">
                        {errorMessage}
                      </span>
                    )}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-12">
                  <FileUploader
                    value={files}
                    maxFiles={24}
                    maxSize={10 * 1024 * 1024 * 1024}
                    onValueChange={setFiles}
                    multiple={true}
                  />
                  {files.length > 0 && (
                    <Button
                      animated
                      fullWidth
                      animatedSize="grow"
                      className="w-full mt-5"
                      disabled={createDocustreamMutation.isPending}
                      onClick={async () => {
                        await createDocustream();
                      }}
                    >
                      {createDocustreamMutation.isPending ? (
                        <div className="flex items-center justify-center">
                          <Spinner size="small" className="text-white" />
                          <span className="ml-2">Creating Docustream...</span>
                        </div>
                      ) : (
                        "Upload and create Docustream"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {stage === "done" && (
              <div>
                <DrawerHeader>
                  <DrawerTitle>Your notes are generating 🔥</DrawerTitle>
                  <DrawerDescription className="pb-4">
                    You will have your transcript and default document in less
                    than a minute.
                  </DrawerDescription>
                  <DrawerFooter className="grid grid-cols-2 gap-2 pt-4 pb-12">
                    <DrawerClose>
                      <Button
                        variant="secondary"
                        className="w-full hover:bg-neutrals-5/70"
                      >
                        Close and go back
                      </Button>
                    </DrawerClose>
                    <Button onClick={async () => await clear()}>
                      Upload more audio
                    </Button>
                  </DrawerFooter>
                </DrawerHeader>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
