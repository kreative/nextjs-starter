import Image from "next/image";
import { useState, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import {
  ClipboardText,
  TrashSimple,
  FilePdf,
  Microphone,
} from "@phosphor-icons/react/dist/ssr";
import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocuStreamTranscript } from "@/lib/transcripts";
import { useToast } from "@/components/ui/use-toast";
import TranscriptSkeleton from "@/components/docustreams/TranscriptSkeleton";
import PatientAvatar from "../patients/PatientAvatar";
import { DSAudioFile } from "@/components/svgs/ds-audiofile";
import DSProvider from "@/components/docustreams/docustreams_table/DSProvider";
import { deleteAudioForDocustream } from "@/lib/audio";
import Summary from "@/components/docustreams/Summary";
import RenderTranscript from "./RenderTranscript";
import RenderTranscriptPDF from "./RenderTranscriptPDF";
import RecordButton from "@/components/RecordButton";
import IDocuStream from "@/types/IDocuStream";

interface TranscriptProps {
  docustream: IDocuStream;
  docustream_id: number;
  patientName: string;
  patientSpecies: string;
  patientIcon?: number;
  provider_id: number;
  hasAudio: boolean;
  summary?: string;
}

export default function Transcript(props: TranscriptProps) {
  const queryClient = useQueryClient();
  const [hasAudio, setHasAudio] = useState(props.hasAudio);
  const [open, setIsOpen] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();

  const audioFileName = useMemo(() => {
    const patientName = props.patientName.replace(" ", "_").toLowerCase();
    const species = props.patientSpecies.toLowerCase();

    return `${patientName}_${species}.m4a`;
  }, [props]);

  const { isPending, isSuccess, data } = useQuery({
    queryKey: ["docustream_transcript", props.docustream_id],
    queryFn: async () => {
      const transcript = await getDocuStreamTranscript({
        docustram_id: props.docustream_id,
        key: cookies.kreative_id_key,
      });

      return transcript;
    },
  });

  function handleCopy() {
    const text = document.getElementById("transcript")?.innerText;
    navigator.clipboard.writeText(text!);

    // @ts-ignore
    global?.analytics?.track("ds_transcript_copied_to_clipboard", {
      docustreamId: props.docustream_id,
    });

    toast({
      title: "Copied to clipboard",
      description: "The transcript has been copied to your clipboard.",
    });
  }

  const deleteAudioMutation = useMutation({
    mutationFn: async () => {
      return await deleteAudioForDocustream({
        key: cookies.kreative_id_key,
        docustreamId: props.docustream_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["docustream", props.docustream_id],
      });
      setHasAudio(false);
      toast({
        title: `${audioFileName} deleted.`,
        description: "The audio file has been successfully deleted.",
      });
      setIsOpen(false);
    },
  });

  const Pdf = () => (
    <Document>
      <Page
        size="A4"
        style={{
          padding: 24,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: -0.02,
              paddingVertical: 24,
            }}
          >
            Transcript
          </Text>
          <View style={{ flexDirection: "column", width: "100%" }}>
            <RenderTranscriptPDF
              docustreamId={props.docustream_id}
              transcript={data.transcript}
            />
          </View>
        </View>
      </Page>
    </Document>
  );

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={setIsOpen}>
        <Summary summary={props.summary} className="mb-2" />
        {isPending && <TranscriptSkeleton />}
        {isSuccess && (
          <div>
            <div className="rounded-xl bg-white/70 border border-neutrals-4 w-full px-5 py-3 mb-2 flex flex-col min-[740px]:flex-row items-center justify-between">
              <div className="flex items-start min-[740px]:items-center gap-3 w-full min-[740px]:w-auto">
                <DSAudioFile className="h-16 hidden min-[740px]:block" />
                <Image
                  src={"/ds-audiofile.webp"}
                  alt="audio file"
                  width={30}
                  height={42}
                  className="w-auto h-[3.2rem] drop-shadow-md block min-[740px]:hidden"
                />
                <div>
                  <p className="text-lg font-bold">{audioFileName}</p>
                  <div className="flex items-center justify-start space-x-2">
                    <DSProvider
                      provider_id={props.provider_id}
                      prefix="recorded by"
                    />
                    <p className="hidden min-[560px]:block">for</p>
                    <PatientAvatar
                      speciesName={props.patientSpecies}
                      iconInt={props.patientIcon}
                      className="w-5 h-5 hidden min-[560px]:block"
                    />
                    <p className="hidden min-[560px]:block">
                      {props.patientName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 min-[740px]:flex items-center space-x-2 justify-end w-full min-[740px]:w-auto pt-4 min-[740px]:pt-0">
                <RecordButton
                  triggerClassname="w-full min-[740px]:w-auto"
                  givenDocustream={props.docustream}
                  afterUpload={() => {
                    setTimeout(() => {
                      const dsDate = props.docustream.start_time;
                      const date = encodeURIComponent(
                        new Date(dsDate).toString()
                      );
                      window.location.href = `/dash/docustreams?date=${date}`;
                    }, 500);
                  }}
                >
                  <Button
                    variant="outline"
                    className="bg-white/80 hover:border-seafoam-100 hover:bg-seafoam-50 hover:text-seafoam-700 rounded-lg w-full min-[740px]:w-auto"
                  >
                    <Microphone weight="bold" className="w-4 h-4 mr-2" />
                    <p className="text-md font-medium">Add more</p>
                  </Button>
                </RecordButton>
                <Button
                  disabled={!hasAudio}
                  variant="outline"
                  className="bg-white/80 hover:border-red-100 hover:bg-red-100 hover:text-red-600 rounded-lg"
                  onClick={() => setIsOpen(true)}
                >
                  <TrashSimple weight="bold" className="w-4 h-4 mr-2" />
                  <p className="text-md font-medium">Delete</p>
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-white/70 border border-neutrals-4 w-full py-8 px-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center font-bold">
                  <PatientAvatar
                    speciesName={props.patientSpecies}
                    iconInt={props.patientIcon}
                    className="w-5 h-5 mr-1.5"
                  />
                  <p>{props.patientName}</p>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="text-neutrals-8"
                          onClick={handleCopy}
                        >
                          <ClipboardText
                            weight="bold"
                            className="w-4 h-4 text-neutrals-8"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-[150px] p-2 flex items-center justify-center">
                        <p className="text-[14px] text-neutrals-10 font-medium text-center">
                          Copy transcript to clipboard
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PDFDownloadLink
                          document={<Pdf />}
                          fileName="transcript.pdf"
                        >
                          {({ blob, url, loading, error }) => (
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              className="text-neutrals-8"
                            >
                              <FilePdf
                                weight="bold"
                                className="w-4 h-4 text-neutrals-8"
                              />
                            </Button>
                          )}
                        </PDFDownloadLink>
                      </TooltipTrigger>
                      <TooltipContent className="w-[190px] p-2 flex items-center justify-center">
                        <p className="text-[14px] text-neutrals-10 font-medium">
                          Export this transcript as PDF
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <h2 className="text-2xl text-center font-bold tracking-tight mb-3 sm:mb-6 pt-2 sm:pt-0">
                Transcript
              </h2>
              <p className="text-neutrals-13" id="transcript">
                <RenderTranscript
                  docustreamId={props.docustream_id}
                  transcript={data.transcript}
                />
              </p>
            </div>
          </div>
        )}
        <DialogContent className="rounded-2xl sm:rounded-xl">
          <DialogHeader>
            <p className="text-left font-bold tracking-tight text-2xl">
              Are you sure?
            </p>
          </DialogHeader>
          <p className="text-md">
            Deleting this audio will permanently delete this file them for all
            users across your clinic.{" "}
            <span className="text-red-600 font-medium">
              This action is irreversible and you will not be able to recover
              it.
            </span>
          </p>
          <DialogFooter className="grid grid-cols-2 gap-2">
            <DialogClose asChild>
              <Button
                className="w-full text-md"
                type="button"
                variant="secondary"
              >
                Nevermind
              </Button>
            </DialogClose>
            <Button
              variant={"destructive"}
              className="w-full text-md"
              onClick={() => deleteAudioMutation.mutateAsync()}
            >
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
