import he from "he";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createDocument } from "@/lib/documents";
import IDocumentType from "@/types/IDocumentType";
import { useCookies } from "react-cookie";
import { useQueryClient } from "@tanstack/react-query";

interface NewDocumentButtonProps {
  docustreamId: number;
  documentTypes: IDocumentType[];
  children: React.ReactNode;
  onNewDocument?: () => void;
}

export default function NewDocumentButton(props: NewDocumentButtonProps) {
  const [cookies] = useCookies(["kreative_id_key"]);
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        {props.children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-lg border-none shadow-xl">
        <DropdownMenuLabel className="tracking-tight">
          What would you like to generate?
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {props.documentTypes.map((documentType: IDocumentType) => {
          const label = documentType?.category?.toLowerCase().replace("_", " ");

          return (
            <DropdownMenuItem
              key={documentType.id}
              className="hover:cursor-pointer"
              onClick={async () => {
                await createDocument(
                  cookies.kreative_id_key,
                  props.docustreamId,
                  [documentType.id!]
                );
                queryClient.invalidateQueries({
                  queryKey: [
                    "docustreams",
                    props.docustreamId.toString(),
                    "documents",
                  ],
                });
                if (props.onNewDocument) props.onNewDocument();
              }}
            >
              <span
                role="img"
                aria-label={`${documentType.name} emoji`}
                className="mr-2"
              >
                {he.decode(documentType.emoji_icon || "")}
              </span>
              <span className="mr-2 font-medium tracking-tight">
                {documentType.name}
              </span>
              {documentType.category === "MEDICAL_RECORD" && (
                <span className="text-xs rounded-lg px-2 bg-medicalblue-50 text-medicalblue-700">
                  {label}
                </span>
              )}
              {documentType.category === "EMAIL" && (
                <span className="text-xs rounded-lg px-2 bg-seafoam-50 text-seafoam-700">
                  {label}
                </span>
              )}
              {documentType.category === "LETTER" && (
                <span className="text-xs rounded-lg px-2 bg-pruple-100 text-purple-700">
                  {label}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
