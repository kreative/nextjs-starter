import _ from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import {
  Microphone,
  FlagCheckered,
  SealCheck,
  PencilSimpleLine,
  TrashSimple,
  Note,
  ArrowLineLeft,
  ArrowBendUpLeft,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import IDocuStream from "@/types/IDocuStream";
import { cn, getDay, getMonth } from "@/lib/utils";
import DSProvider from "@/components/docustreams/docustreams_table/DSProvider";
import CalendarIcon from "@/components/CalendarIcon";
import EditDSButton from "../EditDSButton";
import DeleteDSButton from "../DeleteDSButton";
import { motion } from "framer-motion";
import PatientAvatar from "@/components/patients/PatientAvatar";
import StatusChangeButton from "../StatusChangeButton";
import { updateDocuStream } from "@/lib/docustreams";
import { useCookies } from "react-cookie";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecordButton from "@/components/RecordButton";

export default function DocuStreamsTable({
  data,
  isPending,
  isSuccess,
  showingActive,
}: {
  data: any;
  isPending: boolean;
  isSuccess: boolean;
  showingActive: boolean;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [docustream, setDocuStream] = useState<IDocuStream | null>(null);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();

  function handleRowClick(docustream: IDocuStream) {
    setDocuStream(docustream);
    setOpen(true);
  }

  function handleEdit(docustream: IDocuStream) {
    setDocuStream(docustream);
  }

  function handleDelete() {
    queryClient.invalidateQueries({ queryKey: ["docustreams"] });
    setOpen(false);
  }

  function getFormattedMinutes(minutes: number): string {
    if (minutes < 10) {
      return `0${minutes}`;
    }
    return minutes.toString();
  }

  function getFormattedTime(time: string): string {
    const start_time = new Date(time);
    const hours = start_time.getHours();
    const minutes = start_time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const hours12 = hours > 12 ? hours - 12 : hours;
    return `${hours12}:${getFormattedMinutes(minutes)} ${ampm}`;
  }

  const getFontSize = (title?: string): string => {
    if (!title) return "text-4xl";
    if (title.length <= 15) return "text-4xl";
    else if (title.length > 15 && title.length <= 25) return "text-3xl";
    else if (title.length > 25 && title.length <= 35) return "text-2xl";
    else return "text-xl";
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between rounded-full text-seafoam-700 my-6">
          <div className="flex items-center justify-start space-x-1.5">
            <FlagCheckered weight="bold" className="h-6 w-6" />
            <span className="text-xl font-bold">Ready for review</span>
          </div>
          <div className="text-sm text-seafoam-700 flex items-center justify-center font-bold">
            {!isPending ? (
              <p>
                {
                  _.filter(data?.docustreams, (docustream) => {
                    return (
                      docustream.status === "Ready" ||
                      docustream.status === "Generating"
                    );
                  }).length
                }
              </p>
            ) : (
              "0"
            )}
          </div>
        </div>
        <DataTable
          hideSearch={true}
          columns={columns}
          onRowClick={handleRowClick}
          isLoading={isPending}
          data={_.filter(data?.docustreams, (docustream) => {
            return (
              docustream.status === "Ready" ||
              docustream.status === "Generating"
            );
          })}
        />
        <div className="flex items-center justify-between rounded-full text-[#4DAE2A] my-6">
          <div className="flex items-center justify-start space-x-1.5">
            <SealCheck weight="bold" className="h-6 w-6" />
            <span className="text-xl font-bold">Marked complete</span>
          </div>
          <div className="text-sm text-[#4DAE2A] flex items-center justify-center font-bold">
            {!isPending ? (
              <p>
                {
                  _.filter(data?.docustreams, (docustream) => {
                    return docustream.status === "Completed";
                  }).length
                }
              </p>
            ) : (
              "0"
            )}
          </div>
        </div>
        <DataTable
          hideSearch={true}
          columns={columns}
          onRowClick={handleRowClick}
          isLoading={isPending}
          data={_.filter(data?.docustreams, (docustream) => {
            return docustream.status === "Completed";
          })}
        />
        <DrawerContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          className="px-4"
        >
          <DrawerHeader className="mt-6 mb-2">
            <Image
              src={"/ds-audiofile.webp"}
              alt="audio file"
              width={30}
              height={42}
              className="w-full h-auto max-w-[72px] drop-shadow-md mb-4"
            />
            <DrawerTitle>
              <h2
                className={cn(
                  "font-bold flex items-center justify-start text-left",
                  getFontSize(docustream?.title)
                )}
              >
                {docustream?.title}
                {docustream?.status === "Generating" && (
                  <Spinner
                    size="small"
                    className="text-brand-forrest ml-2 -mb-1"
                  />
                )}
              </h2>
            </DrawerTitle>
            <DSProvider
              provider_id={docustream?.provider_id || 0}
              className="text-xl"
            />
          </DrawerHeader>
          <ScrollArea className="h-full overflow-y-auto px-4 pb-12">
            {["Ready", "Completed"].includes(docustream?.status || "") && (
              <div className="pt-4 font-medium text-left">
                <p className="flex items-center justify-start font-medium text-md text-brand-forrest pb-1">
                  <Sparkle weight="bold" size={16} className="mr-2" />
                  Summary
                </p>
                {docustream?.summary &&
                docustream?.summary !== "" &&
                docustream?.summary !== "NA" ? (
                  docustream?.summary
                ) : (
                  <p className="text-neutrals-10 italic">
                    Unavailable for this Docustream.
                  </p>
                )}
              </div>
            )}
            {docustream?.start_time && (
              <div className="flex items-center justify-start space-x-3 pt-6">
                <CalendarIcon
                  month={getMonth(
                    new Date(docustream?.start_time).getMonth()
                  ).slice(0, 3)}
                  day={new Date(docustream?.start_time).getDate()}
                />
                <div className="-mt-0.5">
                  <p className="font-bold text-lg text-left">
                    {getDay(new Date(docustream?.start_time).getDay())}
                  </p>
                  <p className="text-neutrals-8 font-medium text-lg">
                    from{" "}
                    <span className="text-neutrals-13">
                      {getFormattedTime(docustream?.start_time)}
                    </span>{" "}
                    {docustream?.time_uploaded && (
                      <span>
                        →{" "}
                        <span className="text-neutrals-13">
                          {getFormattedTime(docustream?.time_uploaded)}
                        </span>
                      </span>
                    )}{" "}
                    {docustream?.length && (
                      <span>
                        ·{" "}
                        <span className="text-neutrals-13">{`
                    ${Math.floor(docustream?.length / 60)}m ${
                          docustream?.length % 60
                        }s
                  `}</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
            {["Ready", "Completed"].includes(docustream?.status || "") &&
              docustream?.patient?.name &&
              docustream?.patient?.species && (
                <div className="flex justify-start items-center space-x-3 pt-4 mb-8">
                  <PatientAvatar
                    speciesName={docustream?.patient?.species}
                    iconInt={2}
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-neutrals-8">Patient Information</p>
                    <p className="text-lg tracking-tight font-bold text-neutrals-13">
                      {docustream?.patient?.name}{" "}
                      <span className="text-neutrals-7 font-medium">as</span>{" "}
                      {docustream?.patient?.species
                        ?.substring(0, 1)
                        ?.toUpperCase() +
                        docustream?.patient?.species?.substring(1)}
                    </p>
                  </div>
                </div>
              )}
            {docustream &&
              docustream?.status !== "Generating" &&
              showingActive && (
                <RecordButton
                  triggerClassname="w-full"
                  givenDocustream={docustream}
                  afterUpload={() => {
                    setOpen(false);
                  }}
                >
                  <motion.div
                    whileHover={{
                      scale: 0.97,
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer mb-3"
                  >
                    <div className="flex justify-start items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-seafoam-50">
                        <Microphone
                          weight="bold"
                          className="w-6 h-6 text-brand-forrest"
                        />
                      </div>
                      <p className="font-medium text-neutrals-13">
                        Continue recording
                      </p>
                    </div>
                  </motion.div>
                </RecordButton>
              )}
            {(docustream?.status === "Completed" ||
              docustream?.status === "Ready") && (
              <div className="mb-3">
                <Link
                  href={
                    showingActive
                      ? `/dash/docustreams/${docustream?.id}`
                      : `/dash/archive/${docustream?.id}`
                  }
                >
                  <motion.div
                    whileHover={{
                      scale: 0.97,
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer"
                  >
                    <div className="flex justify-start items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-seafoam-50">
                        <Note
                          weight="bold"
                          className="w-6 h-6 text-brand-forrest"
                        />
                      </div>
                      <p className="font-medium text-neutrals-13">
                        View AI-powered documents
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            )}
            {docustream?.id && (
              <div>
                <div>
                  {docustream?.status === "Ready" && (
                    <StatusChangeButton
                      docustreamId={docustream?.id}
                      status="Completed"
                      toastMessage="The DocuStream has been marked as complete."
                      parentCallback={handleDelete}
                    >
                      <motion.div
                        whileHover={{
                          scale: 0.97,
                          transition: { duration: 0.1 },
                        }}
                        whileTap={{ scale: 0.92 }}
                        className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer mb-3"
                      >
                        <div className="flex justify-start items-center space-x-2.5">
                          <div className="p-2 rounded-lg bg-orange-50">
                            <SealCheck
                              weight="bold"
                              className="w-6 h-6 text-yellow-600"
                            />
                          </div>
                          <p className="font-medium text-neutrals-13">
                            Mark this as complete
                          </p>
                        </div>
                      </motion.div>
                    </StatusChangeButton>
                  )}
                </div>
                <div>
                  {docustream?.status === "Completed" && (
                    <StatusChangeButton
                      docustreamId={docustream?.id}
                      status="Ready"
                      toastMessage="The DocuStream has been moved back to review."
                      parentCallback={handleDelete}
                    >
                      <motion.div
                        whileHover={{
                          scale: 0.97,
                          transition: { duration: 0.1 },
                        }}
                        whileTap={{ scale: 0.92 }}
                        className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer mb-3"
                      >
                        <div className="flex justify-start items-center space-x-2.5">
                          <div className="p-2 rounded-lg bg-orange-50">
                            <ArrowLineLeft
                              weight="bold"
                              className="w-6 h-6 text-yellow-600"
                            />
                          </div>
                          <p className="font-medium text-neutrals-13">
                            Move back to Ready for review
                          </p>
                        </div>
                      </motion.div>
                    </StatusChangeButton>
                  )}
                </div>
                <div className="space-y-3">
                  <EditDSButton
                    docustreamId={docustream?.id}
                    queryKey={
                      showingActive
                        ? ["docustreams"]
                        : ["docustreams", "archived"]
                    }
                    parentCallback={handleEdit}
                  >
                    <motion.div
                      whileHover={{
                        scale: 0.97,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{ scale: 0.92 }}
                      className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer"
                    >
                      <div className="flex justify-start items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-medicalblue-50">
                          <PencilSimpleLine
                            weight="bold"
                            className="w-6 h-6 text-medicalblue-700"
                          />
                        </div>
                        <p className="font-medium text-neutrals-13">
                          Edit this DocuStream
                        </p>
                      </div>
                    </motion.div>
                  </EditDSButton>
                  {!showingActive && (
                    <motion.div
                      whileHover={{
                        scale: 0.97,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{ scale: 0.92 }}
                      className="flex justify-between items-center px-1.5 py-1.5 mx-0.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer"
                    >
                      <div
                        className="flex justify-start items-center space-x-2.5"
                        onClick={async () => {
                          await updateDocuStream({
                            key: cookies.kreative_id_key,
                            id: docustream?.id,
                            data: {
                              is_active: true,
                            },
                          });
                          await queryClient.invalidateQueries({
                            queryKey: ["docustreams"],
                          });
                          setOpen(false);
                          toast({
                            title: "DocuStream un-archived 📚",
                            description:
                              "The DocuStream has been successfully restored.",
                          });
                        }}
                      >
                        <div className="flex justify-start items-center space-x-2.5">
                          <div className="p-2 rounded-lg bg-seafoam-50">
                            <ArrowBendUpLeft
                              weight="bold"
                              className="w-6 h-6 text-brand-forrest"
                            />
                          </div>
                          <p className="font-medium text-neutrals-13">
                            Restore this Docustream
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <DeleteDSButton
                    isArchived={!showingActive}
                    docustreamId={docustream?.id}
                    parentCallback={handleDelete}
                  >
                    <motion.div
                      whileHover={{
                        scale: 0.97,
                        transition: { duration: 0.1 },
                      }}
                      whileTap={{ scale: 0.92 }}
                      className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer"
                    >
                      <div className="flex justify-start items-center space-x-2.5">
                        <div className="p-2 rounded-lg bg-red-100">
                          <TrashSimple
                            weight="bold"
                            className="w-6 h-6 text-red-500"
                          />
                        </div>
                        <p className="font-medium text-neutrals-13">
                          Delete this DocuStream
                        </p>
                      </div>
                    </motion.div>
                  </DeleteDSButton>
                </div>
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
