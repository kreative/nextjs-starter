import DocumentTypesTable from "./documentTypes/DocumentTypesTable";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { getDocumentTypes, getPrebuiltDocumentTypes } from "@/lib/document_types";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import CreateNewDocTypeButton from "./documentTypes/CreateNewDocTypeButton";

export default function DocumentTypesManager() {
  const [cookies] = useCookies(["kreative_id_key"]);

  const { data, isPending } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      return getDocumentTypes(cookies.kreative_id_key, true);
    },
  });

  const PrebuiltDocumentTypesQuery = useQuery({
    queryKey: ["prebuiltDocumentTypes"],
    queryFn: async () => {
      return await getPrebuiltDocumentTypes(cookies.kreative_id_key);
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between pb-6">
          <h2 className="text-2xl font-bold tracking-tight">Document Types</h2>
          <CreateNewDocTypeButton
            prebuiltDocumentTypes={
              PrebuiltDocumentTypesQuery?.data?.document_types || []
            }
            prebuiltIsPending={PrebuiltDocumentTypesQuery?.isPending}
          >
            <Button
              className="flex items-center justify-center"
              size="sm"
              animated
            >
              <Plus weight="bold" className="mr-2" color="white" />
              <p className="hidden sm:block">New Document Type</p>
              <p className="block sm:hidden">Add new</p>
            </Button>
          </CreateNewDocTypeButton>
      </div>
      <DocumentTypesTable data={data} isPending={isPending} />
    </div>
  );
}
