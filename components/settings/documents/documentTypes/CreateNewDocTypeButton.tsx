import _ from "lodash";
import he from "he";
import {
  getHTML,
  convertTiptapJSONtoText,
} from "@/lib/utils";
import { Suspense, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { X, Question } from "@phosphor-icons/react/dist/ssr";
import Tiptap from "@/components/Tiptap";
import { useCookies } from "react-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";
import IDocumentType from "@/types/IDocumentType";
import { Input } from "@/components/ui/input";
import { createDocumentType } from "@/lib/document_types";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface NewDocTypeButtonProps {
  prebuiltDocumentTypes: any;
  prebuiltIsPending: boolean;
  children: React.ReactNode;
}

export default function CreateNewDocTypeButton(props: NewDocTypeButtonProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<IDocumentType>({
    name: undefined,
    instructions: "Tell the AI what you want to create...",
    category: undefined,
    emoji_icon: "&#128209",
  });

  const isDisabled =
    _.isEmpty(documentType?.name) || _.isEmpty(documentType?.category);

  async function handleCreate() {
    setIsLoading(true);
    try {
      await createDocumentType({
        key: cookies.kreative_id_key,
        name: documentType.name!,
        emoji_icon: documentType.emoji_icon!,
        category: documentType.category!,
        instructions: documentType.instructions!,
      });
      queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
      toast({
        title: `${documentType.name!} created 🎉`,
        description: "The Document Type has been created successfully.",
      });
      setOpen(false);
      setDocumentType({
        name: undefined,
        instructions: "Tell the AI what you want to create...",
        category: undefined,
        emoji_icon: "&#128209",
      });
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "An error occurred while creating the Document Type.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="tracking-tight">
            Start with our prebuilt types
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {props.prebuiltDocumentTypes &&
            props.prebuiltDocumentTypes.map((docType: any) => {
              const label = docType?.category?.toLowerCase().replace("_", " ");

              return (
                <DropdownMenuItem
                  key={docType.id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setDocumentType({
                      name: docType.name,
                      emoji_icon: docType.emoji_icon,
                      category: docType.category,
                      instructions: docType.instructions,
                    });
                    setDropdownOpen(false);
                    setOpen(true);
                  }}
                >
                  <span
                    role="img"
                    aria-label={`${docType.name} emoji`}
                    className="mr-2"
                  >
                    {he.decode(docType.emoji_icon || "")}
                  </span>
                  <span className="mr-2 font-medium tracking-tight">
                    {docType.name}
                  </span>
                  {docType.category === "MEDICAL_RECORD" && (
                    <span className="text-xs rounded-lg px-2 bg-medicalblue-50 text-medicalblue-700">
                      {label}
                    </span>
                  )}
                  {docType.category === "EMAIL" && (
                    <span className="text-xs rounded-lg px-2 bg-seafoam-50 text-seafoam-700">
                      {label}
                    </span>
                  )}
                  {docType.category === "LETTER" && (
                    <span className="text-xs rounded-lg px-2 bg-pruple-100 text-purple-700">
                      {label}
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="tracking-tight hover:cursor-pointer"
            onClick={() => {
              setDocumentType({
                name: undefined,
                instructions: "Tell the AI what you want to create...",
                category: undefined,
                emoji_icon: "&#128209",
              });
              setDropdownOpen(false);
              setOpen(true);
            }}
          >
            Or start from scratch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
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
                  Create new Document Type
                </h3>
                <div className="flex items-center justify-end">
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
              <div className="flex items-center space-x-4">
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
                            console.log(documentType);
                          }}
                        />
                      </Suspense>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <div className="border-b-2 border-b-black mb-4">
                    <p className="text-md font-medium text-neutrals-8">Name</p>
                    <Input
                      placeholder="Enter name..."
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
                            what you&apos;re expecting to recieve in the
                            Document from it.
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
            <p className="text-md font-medium text-neutrals-8">Instructions</p>
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
              onClick={handleCreate}
              className="w-full mt-4"
              disabled={isDisabled}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner className="text-white mr-2" size={"small"} />
                  Creating...
                </div>
              ) : (
                "Create new Document Type"
              )}
            </Button>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
