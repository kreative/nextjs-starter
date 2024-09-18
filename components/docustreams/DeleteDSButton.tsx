import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";
import { deleteDocuStream, archiveDocusStream } from "@/lib/docustreams";
import { useToast } from "@/components/ui/use-toast";

interface DeleteDSButtonProps {
  isArchived: boolean;
  docustreamId: number;
  parentCallback: (arg: boolean) => void;
  children: React.ReactNode;
}

export default function DeleteDSButton(
  props: DeleteDSButtonProps
): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();

  async function handleArchive() {
    await archiveDocusStream({
      key: cookies.kreative_id_key,
      id: props.docustreamId,
    });
    setIsOpen(false);
    toast({
      title: "DocuStream archived 📚",
      description: "The DocuStream has been successfully archived.",
    });
    props.parentCallback(true);
  }

  async function handleDelete() {
    await deleteDocuStream({
      key: cookies.kreative_id_key,
      id: props.docustreamId,
    });
    setIsOpen(false);
    toast({
      title: "DocuStream deleted 🔥",
      description: "The DocuStream has been successfully deleted.",
    });
    props.parentCallback(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="rounded-2xl sm:rounded-xl">
        <DialogHeader>
          <p className="font-bold tracking-tight text-2xl text-left">
            {props.isArchived ? "Permanently delete?" : "Archive or delete?"}
          </p>
        </DialogHeader>
        <p className="text-md text-left">
          {!props.isArchived && (
            <span>
              Archiving will remove it from your Pipeline view and allow you to
              restore it at any point.
            </span>
          )}{" "}
          <span className="text-red-600 font-medium">
            Deleting will remove all data for this docustream from your clinic
            and isunrecoverable This action is irreversible.
          </span>
        </p>
        {!props.isArchived ? (
          <DialogFooter className="grid grid-cols-3 gap-2">
            <DialogClose asChild>
              <Button
                className="w-full text-md"
                type="button"
                variant="secondary"
              >
                Nevermind
              </Button>
            </DialogClose>
            <Button
              variant={"default"}
              className="w-full text-md"
              onClick={handleArchive}
            >
              Archive
            </Button>
            <Button
              variant={"destructive"}
              className="w-full text-md"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="flex items-center">
            <DialogClose asChild>
              <Button
                className="w-1/2 text-md"
                type="button"
                variant="secondary"
              >
                Nevermind
              </Button>
            </DialogClose>
            <Button
              variant={"destructive"}
              className="w-1/2 text-md"
              onClick={handleDelete}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
