import _ from "lodash";
import { getHTML, convertTiptapJSONtoText } from "@/lib/utils";
import { useState, Suspense } from "react";
import he from "he";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Trash, Question } from "@phosphor-icons/react/dist/ssr";
import Tiptap from "@/components/Tiptap";
import { useCookies } from "react-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";
import IDocumentType from "@/types/IDocumentType";
import { Input } from "@/components/ui/input";
import { updateDocumentType, deleteDocumentType } from "@/lib/document_types";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function DocumentTypesTable({
  data: tableData,
  isPending,
}: {
  data: any;
  isPending: boolean;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentType, setDocumentType] = useState<IDocumentType | null>(null);
  const [original, setOriginal] = useState<IDocumentType | null>(null);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();

  function handleRowClick(documentType: IDocumentType) {
    setDocumentType(documentType);
    setOriginal(documentType);
    setOpen(true);
  }

  async function handleEdit() {
    setIsLoading(true);

    await updateDocumentType(
      cookies.kreative_id_key,
      documentType!.id!,
      documentType
    );

    await queryClient.invalidateQueries({
      queryKey: ["documentTypes"],
    });

    setIsLoading(false);
    setOpen(false);

    toast({
      title: "Document Type updated successfully 🎉",
      description:
        "This new Document Type can be used for all future Docustreams your record!",
    });
  }

  async function handleDelete() {
    setIsDeleting(true);
    await deleteDocumentType(cookies.kreative_id_key, documentType!.id!);
    await queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
    setIsDeleting(false);
    setOpen(false);

    toast({
      title: "Document Type deleted successfully 🎉",
      description:
        "This Document Type will no longer be available for future Docustreams",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataTable
        hideSearch={true}
        hidePagination={true}
        pageSizeForPagination={10}
        onRowClick={handleRowClick}
        columns={columns}
        isLoading={isPending}
        data={_.sortBy(tableData?.document_types, "name")}
      />
      <DialogContent
        className="max-w-3xl"
        showDefaultClose={false}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <ScrollArea>
          <TooltipProvider>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-neutrals-8">
                Manage Document Type
              </h3>
              <div className="flex items-center justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isDeleting ? (
                      <Spinner className="text-red-600 mr-2" size={"small"} />
                    ) : (
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="text-neutrals-8"
                        onClick={handleDelete}
                      >
                        <Trash weight="bold" onClick={handleDelete} />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="w-[200px] p-2 flex items-center justify-center">
                    <p className="text-[14px] text-red-600 font-medium text-center">
                      Delete this Document Type. This is irreversible.
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogClose asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="text-neutrals-8"
                      >
                        <X weight="bold" />
                      </Button>
                    </DialogClose>
                  </TooltipTrigger>
                  <TooltipContent className="w-[150px] p-2 flex items-center justify-center">
                    <p className="text-[14px] text-neutrals-10 font-medium">
                      Go back to Settings
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex items-start sm:items-center space-x-4">
              <div className="mb-4">
                <p className="text-md font-medium text-neutrals-8">Icon</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <p className="w-11 h-11 rounded-lg border border-neutrals-5 text-2xl flex items-center justify-center">
                      {he.decode(documentType?.emoji_icon || "")}
                    </p>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="shadow-xl p-0">
                    <Suspense fallback={<div>Loading</div>}>
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                          setDocumentType({
                            ...documentType,
                            emoji_icon: emoji.native,
                          });
                        }}
                      />
                    </Suspense>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                <div className="border-b-2 border-b-black mb-4">
                  <p className="text-md font-medium text-neutrals-8">Name</p>
                  <Input
                    className="p-0 rounded-0 border-transparent bg-transparent focus-visible:border-transparent focus-visible:ring-0 text-2xl font-bold"
                    value={documentType?.name}
                    onChange={(e) => {
                      setDocumentType({
                        ...documentType,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="border-b-2 border-b-black mb-4">
                  <p className="text-md font-medium text-neutrals-8 flex items-center justify-start">
                    Category
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Question
                          weight="bold"
                          className="ml-1 hover:cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="w-[300px] p-2 flex items-center justify-center">
                        <p className="text-[15px] font-medium">
                          Setting the Category helps us tell our AI more about
                          what you&apos;re expecting to recieve in the Document
                          from it.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <Select
                    onValueChange={(value: string) => {
                      setDocumentType({
                        ...documentType,
                        category: value,
                      });
                    }}
                    defaultValue={documentType?.category}
                  >
                    <SelectTrigger className="p-0 rounded-0 border-transparent bg-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-transparent focus-visible:border-transparent focus-visible:ring-0 font-bold text-2xl">
                      <SelectValue
                        className="text-2xl font-bold"
                        placeholder="Select category..."
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEDICAL_RECORD">
                        Medical Record
                      </SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TooltipProvider>
          <p className="pt-6 sm:pt-0 text-md font-medium text-neutrals-8">
            Instructions
          </p>
          <Tiptap
            additionalStyles={{
              border: "1px solid #E5E7EB",
              borderRadius: "0.25rem",
              backgroundColor: "rgba(255,255,255,0.5)",
              marginTop: 12,
              overflowY: "scroll",
            }}
            className="px-4 max-h-[15rem] md:max-h-[25rem] xl:max-h-[30rem]"
            hideSkeleton={true}
            content={getHTML(documentType?.instructions || "")}
            onChange={(tiptapJSON: string) => {
              const content = convertTiptapJSONtoText(tiptapJSON);
              setDocumentType({
                ...documentType,
                instructions: content,
              });
            }}
          />
          <Button
            onClick={handleEdit}
            disabled={_.isEqual(documentType, original)}
            className="w-full mt-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner className="text-white mr-2" size={"small"} />
                Saving...
              </div>
            ) : (
              "Save changes"
            )}
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
