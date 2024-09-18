import _ from "lodash";
import Link from "next/link";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  Microphone,
  FlagCheckered,
  SealCheck,
  Brain,
  PencilSimpleLine,
  TrashSimple,
  Note,
  ArrowLineLeft,
  ArrowBendUpLeft,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import IDocuStream from "@/types/IDocuStream";
import { getDay, getMonth } from "@/lib/utils";
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

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
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
            return docustream.status === "Ready" || docustream.status === "Generating";
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
        <SheetContent
          side="right"
          className="w-[600px]"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <ScrollArea className="h-full overflow-y-auto">
            <SheetHeader className="flex flex-col items-start mt-6 mb-6">
              <svg
                viewBox="0 0 33 42"
                fill="none"
                className="h-20 w-auto drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_i_1082_906)">
                  <path
                    d="M0 4C0 2.89543 0.895431 2 2 2H23.55L31.4 9.85V39.25C31.4 40.3546 30.5046 41.25 29.4 41.25H2C0.89543 41.25 0 40.3546 0 39.25V4Z"
                    fill="white"
                  />
                </g>
                <path
                  d="M0.15 4C0.15 2.97827 0.978273 2.15 2 2.15H23.4879L31.25 9.91213V39.25C31.25 40.2717 30.4217 41.1 29.4 41.1H2C0.978273 41.1 0.15 40.2717 0.15 39.25V4Z"
                  stroke="#E5E5E5"
                  strokeWidth="0.3"
                />
                <g filter="url(#filter1_d_1082_906)">
                  <path d="M23.5 10V2L31.5 10H23.5Z" fill="#FBFBFB" />
                  <path
                    d="M23.6 9.9V2.24142L31.2586 9.9H23.6Z"
                    stroke="#F3F3F3"
                    strokeWidth="0.2"
                  />
                </g>
                <path
                  d="M18.598 14.0933C18.4433 14.0176 18.2705 13.9869 18.0992 14.0047C17.9278 14.0225 17.765 14.0879 17.629 14.1937L12.3587 18.2927H8.99481C8.58818 18.2927 8.19821 18.4543 7.91067 18.7418C7.62314 19.0293 7.46161 19.4193 7.46161 19.8259V24.7322C7.46161 25.1388 7.62314 25.5288 7.91067 25.8163C8.19821 26.1039 8.58818 26.2654 8.99481 26.2654H12.3587L17.629 30.3644C17.765 30.4702 17.9279 30.5357 18.0992 30.5534C18.2705 30.5712 18.4433 30.5405 18.5981 30.4649C18.7528 30.3892 18.8832 30.2716 18.9744 30.1255C19.0656 29.9794 19.114 29.8107 19.114 29.6384V14.9197C19.1139 14.7474 19.0656 14.5787 18.9744 14.4326C18.8832 14.2865 18.7528 14.1689 18.598 14.0933ZM9.30145 20.1326H11.7546V24.4255H9.30145V20.1326ZM17.2741 27.7572L13.5944 24.8955V19.6626L17.2741 16.8009V27.7572ZM22.7936 22.2791C22.7938 23.1008 22.4939 23.8943 21.9504 24.5106C21.8704 24.6012 21.7734 24.6752 21.6649 24.7283C21.5564 24.7814 21.4385 24.8127 21.3179 24.8202C21.1973 24.8278 21.0764 24.8115 20.9621 24.7723C20.8478 24.7331 20.7424 24.6718 20.6518 24.5919C20.5612 24.512 20.4872 24.415 20.4341 24.3064C20.3809 24.1979 20.3497 24.08 20.3422 23.9594C20.3346 23.8388 20.3509 23.7179 20.3901 23.6036C20.4293 23.4893 20.4906 23.3839 20.5705 23.2933C20.8169 23.0133 20.9529 22.6532 20.9529 22.2802C20.9529 21.9072 20.8169 21.5471 20.5705 21.2671C20.4173 21.0831 20.342 20.8465 20.3605 20.6077C20.3789 20.369 20.4898 20.1468 20.6695 19.9885C20.8492 19.8302 21.0835 19.7482 21.3227 19.7599C21.5619 19.7716 21.787 19.8762 21.9504 20.0513C22.4934 20.6664 22.7933 21.4586 22.7936 22.2791ZM25.86 22.2791C25.861 23.8632 25.2771 25.3919 24.2203 26.572C24.0576 26.7539 23.8294 26.8637 23.5858 26.8773C23.3422 26.8909 23.1031 26.8071 22.9213 26.6445C22.7394 26.4818 22.6296 26.2536 22.616 26.01C22.6024 25.7664 22.6862 25.5273 22.8488 25.3455C23.6031 24.5022 24.0201 23.4105 24.0201 22.2791C24.0201 21.1477 23.6031 20.0559 22.8488 19.2126C22.765 19.1232 22.6999 19.0179 22.6573 18.9029C22.6148 18.788 22.5956 18.6657 22.601 18.5432C22.6064 18.4207 22.6362 18.3006 22.6887 18.1898C22.7412 18.079 22.8153 17.9798 22.9066 17.8981C22.998 17.8163 23.1047 17.7536 23.2206 17.7137C23.3366 17.6738 23.4593 17.6575 23.5816 17.6657C23.7039 17.6739 23.8233 17.7065 23.9329 17.7615C24.0424 17.8165 24.1399 17.8929 24.2195 17.9861C25.2766 19.1661 25.8608 20.6948 25.86 22.2791Z"
                  fill="url(#paint0_linear_1082_906)"
                />
                <defs>
                  <filter
                    id="filter0_i_1082_906"
                    x="0"
                    y="2"
                    width="31.4"
                    height="39.25"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.508311 0 0 0 0 0.508311 0 0 0 0 0.508311 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_1082_906"
                    />
                  </filter>
                  <filter
                    id="filter1_d_1082_906"
                    x="21"
                    y="0.5"
                    width="12"
                    height="12"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="-0.5" dy="0.5" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.487774 0 0 0 0 0.487774 0 0 0 0 0.487774 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_1082_906"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1082_906"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_1082_906"
                    x1="16.6608"
                    y1="13.9998"
                    x2="16.6608"
                    y2="30.5583"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#076448" />
                    <stop offset="1" stopColor="#086268" />
                  </linearGradient>
                </defs>
              </svg>
              <h2 className="text-2xl font-bold pt-3 flex items-center justify-start">
                {docustream?.title}
                {docustream?.status === "Generating" && (
                  <Spinner
                    size="small"
                    className="text-brand-forrest ml-2 -mb-1"
                  />
                )}
              </h2>
              <DSProvider
                provider_id={docustream?.provider_id || 0}
                className="text-xl"
              />
              {["Ready", "Completed"].includes(docustream?.status || "") && (
                <div className="pt-4 font-medium">
                  <p className="flex items-center justify-start font-medium text-sm text-brand-forrest pb-1">
                    <Sparkle weight="bold" size={16} className="mr-2" />
                    Summary
                  </p>
                  {docustream?.summary &&
                  docustream?.summary !== "" &&
                  docustream?.summary !== "NA" ? (
                    docustream?.summary
                  ) : (
                    <p className="text-neutrals-10 italic">
                      Unavailable for this Docustream
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
                    <p className="font-bold text-lg">
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
            </SheetHeader>
            {["Ready", "Completed"].includes(docustream?.status || "") &&
              docustream?.patient?.name &&
              docustream?.patient?.species && (
                <div className="flex justify-start items-center space-x-3">
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
            <div className="border-t border-neutrals-5 pb-6 mt-6" />
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
                      className="flex justify-between items-center px-1.5 py-1.5 rounded-xl border border-neutrals-5 bg-white hover:cursor-pointer"
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
