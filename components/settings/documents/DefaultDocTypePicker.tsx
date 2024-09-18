import { useState, useRef } from "react";
import { getDocumentTypes } from "@/lib/document_types";
import { updateUser } from "@/lib/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Skeleton } from "../../ui/skeleton";
import { userStore } from "@/stores/user";
import { useAtom } from "jotai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DefaultDocTypePickerProps {}

export default function DefaultDocTypePicker(props: DefaultDocTypePickerProps) {
  const [cookies] = useCookies(["kreative_id_key"]);
  const [user] = useAtom(userStore);
  const [selectedDocType, setSelectedDocType] = useState(
    user?.default_doc_type || 0
  );
  const queryClient = useQueryClient();
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["documentTypes", "withoutInstructions"],
    queryFn: async () => {
      return await getDocumentTypes(cookies.kreative_id_key);
    },
  });

  const handleUpdate = async (data: any) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(async () => {
      await updateUser({
        ksn: user.ksn,
        key: cookies.kreative_id_key,
        data,
      });

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }, 1000);
  };

  return (
    <div>
      <h3 className="pb-2 text-xl font-bold tracking-tight">
        Default Document Type
      </h3>
      <p className="text-neutrals-8 pb-4 text-md">
        Our AI will create this document for each Docustream you record
        automatically.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {isLoading && <Skeleton className="h-8 w-full" />}
        {isSuccess && data && (
          <Select
            onValueChange={(value: string) => {
              setSelectedDocType(parseInt(value));
              handleUpdate({ default_doc_type: parseInt(value) });
            }}
            value={selectedDocType.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default document type..." />
            </SelectTrigger>
            <SelectContent>
              {data.document_types.map((docType: any) => (
                <SelectItem key={docType.id} value={docType.id.toString()}>
                  {docType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
