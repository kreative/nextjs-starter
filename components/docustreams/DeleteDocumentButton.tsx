import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "@/lib/documents";
import { Spinner } from "@/components/ui/spinner";

interface DeleteDocumentButtonProps {
  documentId: number;
  docustreamId: number;
  disabled?: boolean;
  children: React.ReactNode;
  onDeleted?: () => void;
}

export default function DeleteDocumentButton(props: DeleteDocumentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function handleDelete() {
    setLoading(true);
    await deleteDocument(cookies.kreative_id_key, props.documentId);
    await queryClient.invalidateQueries({
      queryKey: ["docustreams", props.docustreamId.toString(), "documents"],
    });
    toast({
      title: "Document deleted 🔥",
      description: "The Document has been successfully deleted.",
    });
    setIsOpen(false);
    setLoading(false);
    if (props.onDeleted) props.onDeleted();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="rounded-2xl sm:rounded-xl">
        <DialogHeader className="text-left">
          <p className="font-bold tracking-tight text-2xl text-left">
            Permanently delete this Document?
          </p>
        </DialogHeader>
        <p className="text-md">
          Deleting will permanently remove this Document from your account.
          <span className="text-red-600 font-medium pb-4">
            This action is irreversible.
          </span>
        </p>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button className="w-full text-md" type="button" variant="secondary">
              Nevermind
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            className="w-full text-md"
            onClick={handleDelete}
            disabled={props.disabled}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="small" className="text-white mr-2" />
                <p>Deleting...</p>
              </div>
            ) : (
              <div>Yes, Delete</div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
