import { cn } from "@/lib/utils";
import he from "he";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react/dist/ssr";
import IDocumentType from "@/types/IDocumentType";
import TruncatedText from "@/components/TruncatedText";

export const columns: ColumnDef<IDocumentType>[] = [
  {
    accessorKey: "name",
    sortingFn: (a, b) => {
      return b.original
        .name!.toLowerCase()
        .localeCompare(a.original.name!.toLowerCase());
    },
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            Name
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const documentType = row.original;

      return (
        <h3 className="text-neutrals-13 font-bold text-[17px] tracking-tight pb-0.5 flex items-center justify-start">
          <span
            role="img"
            aria-label="Document Type Emoji Icon"
            className="mr-2"
          >
            {he.decode(documentType.emoji_icon!)}
          </span>
          <p className="hidden sm:block">{documentType.name}</p>
          <p className="hidden min-[390px]:block sm:hidden">
            <TruncatedText text={documentType.name!} maxLength={10} />
          </p>
          <p className="block min-[390px]:hidden sm:hidden">
            <TruncatedText text={documentType.name!} maxLength={6} />
          </p>
        </h3>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            Category
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      switch (row.original.category) {
        case "MEDICAL_RECORD":
          return (
            <div className="flex flex-col items-end space-y-1">
              <p className="bg-medicalblue-50 text-medicalblue-700 text-md capitalize font-medium py-0.5 px-2 rounded-md">
                Medical Record
              </p>
            </div>
          );
        case "EMAIL":
          return (
            <div className="flex flex-col items-end space-y-1">
              <p className="bg-seafoam-50 text-seafoam-700 text-md capitalize font-medium py-0.5 px-2 rounded-md">
                Email
              </p>
            </div>
          );
        case "LETTER":
          return (
            <div className="flex flex-col items-end space-y-1">
              <p className="bg-purple-100 text-purple-700 text-md capitalize font-medium py-0.5 px-2 rounded-md">
                Letter
              </p>
            </div>
          );
      }
    },
  },
];
