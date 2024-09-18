import { useCookies } from "react-cookie";
import { updateDocuStream } from "@/lib/docustreams";
import { useToast } from "@/components/ui/use-toast";

interface StatusChangeButtonProps {
  docustreamId: number;
  status: string;
  toastMessage: string;
  parentCallback?: (arg: boolean) => void;
  children: React.ReactNode;
}

export default function StatusChangeButton(
  props: StatusChangeButtonProps
): JSX.Element {
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();

  async function handleStatusChange() {
    await updateDocuStream({
      key: cookies.kreative_id_key,
      id: props.docustreamId,
      data: { status: props.status },
    });
    toast({
      title: "DocuStream status updated 🔥",
      description: props.toastMessage,
    });
    if (props.parentCallback) props.parentCallback(true);
  }

  return <div onClick={handleStatusChange}>{props.children}</div>;
}
