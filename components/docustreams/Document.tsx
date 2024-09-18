import IDocument from "../../types/IDocument";
import _ from "lodash";
import he from "he";
import { getHTML, convertTiptapJSONtoText } from "@/lib/utils";
import { useRef, useMemo, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Copy,
  FilePdf,
  PaperPlaneTilt,
  Printer,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import {
  Document as PdfDocument,
  Page,
  Text,
  View,
  Image,
  PDFDownloadLink,
  BlobProvider,
} from "@react-pdf/renderer";
import PatientAvatar from "../patients/PatientAvatar";
import Summary from "@/components/docustreams/Summary";
import { userStore } from "@/stores/user";
import { useAtom } from "jotai";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import Tiptap from "@/components/Tiptap";
import { updateDocument } from "@/lib/documents";
import { useCookies } from "react-cookie";
import DeleteDocumentButton from "./DeleteDocumentButton";
import ScoringPanel from "./ScoringPanel";
import { Player } from "@lottiefiles/react-lottie-player";
import IPatientSignalment from "@/types/IPatientSignalment";
import PatientSignalment from "@/components/docustreams/PatientSignalment";

interface DocumentProps {
  patient: IPatientSignalment;
  patientIcon: number;
  docustreamId: number;
  summary: string;
  document: IDocument;
  onDelete?: (documentId: number) => void;
}

export default function Document(props: DocumentProps) {
  const [docContent, setDocContent] = useState(props.document.content);
  const [user] = useAtom(userStore);
  const { toast } = useToast();
  const [cookies] = useCookies(["kreative_id_key"]);

  const queryClient = useQueryClient();
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const PatientTag = useMemo(
    () => (
      <div className="flex items-center font-bold">
        <PatientAvatar
          speciesName={props.patient.species}
          iconInt={props.patientIcon}
          className="w-5 h-5 mr-1.5"
        />
        <span className="hidden min-[475px]:block">{props.patient.name}</span>
      </div>
    ),
    [props]
  );

  const handleUpdate = async (newContentJSON: any) => {
    const newContent = convertTiptapJSONtoText(newContentJSON);
    setDocContent(newContent);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(async () => {
      await updateDocument(cookies.kreative_id_key, props.document.id, {
        content: newContent,
      });

      queryClient.invalidateQueries({
        queryKey: ["docustreams", props.document.docustream_id],
      });
    }, 1000);
  };

  const handleCopy = () => {
    let text = props.document.content;

    if (user?.show_kdv_notice_on_copy) {
      text = `${text}\n\nMedical Notes generated with Kreative DocuVet AI.`;
    }
    navigator.clipboard.writeText(text!);

    // @ts-ignore
    global?.analytics?.track("document_copied_to_clipboard", {
      docustreamId: props.document.docustream_id,
      documentId: props.document.id,
      patient: props.patient,
    });

    toast({
      title: "Copied to clipboard",
      description: `${he.decode(props.document.document_type_emoji_icon)} ${
        props.document.document_type_name
      } has been copied to your clipboard.`,
    });
  };

  const handleOpenInEmail = () => {
    const body = docContent!
      .split("\n")
      .map((parts: string) => encodeURIComponent(parts))
      .join("%0D%0A");

    window.open(`mailto:customer@example.com?body=${body}`, "_blank");
  };

  useEffect(() => {
    if (props.document.status === "Completed") {
      setDocContent(props.document.content);
    }
  }, [props.document]);

  const Pdf = () => (
    <PdfDocument>
      <Page
        size="A4"
        style={{
          padding: 24,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {user?.pdf_custom_image && user?.pdf_custom_image && (
            <Image
              src={user?.pdf_custom_image}
              style={{
                width: 200,
              }}
            />
          )}
          <Text style={{ color: "#5b5a5b", fontSize: 12 }}>
            {user?.pdf_top_page_info}
          </Text>
        </View>
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
              fontWeight: 700,
              letterSpacing: -0.02,
              paddingBottom: 24,
              paddingTop: 42,
            }}
          >
            {props.document.title}
          </Text>
          <View style={{ flexDirection: "column", width: "100%" }}>
            {user?.pdf_include_summary && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16, marginBottom: 4 }}>Summary</Text>
                <Text style={{ fontSize: 14, color: "#6d6c6d" }}>
                  {props.summary}
                </Text>
              </View>
            )}
            {user?.pdf_include_patient && (
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{ fontSize: 14, marginBottom: 4, paddingVertical: 4 }}
                >
                  Patient Signalment
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ marginRight: 24 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#6d6c6d",
                        marginBottom: 3,
                      }}
                    >
                      Name
                    </Text>
                    <Text style={{ fontSize: 12, color: "#086268" }}>
                      {props.patient.name}
                    </Text>
                  </View>
                  <View style={{ marginRight: 24 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#6d6c6d",
                        marginBottom: 3,
                      }}
                    >
                      Species
                    </Text>
                    <Text style={{ fontSize: 12, color: "#086268" }}>
                      {props.patient.species}
                    </Text>
                  </View>
                  <View style={{ marginRight: 24 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#6d6c6d",
                        marginBottom: 3,
                      }}
                    >
                      Breed
                    </Text>
                    <Text style={{ fontSize: 12, color: "#086268" }}>
                      {props.patient.breed}
                    </Text>
                  </View>
                  <View style={{ marginRight: 24 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#6d6c6d",
                        marginBottom: 3,
                      }}
                    >
                      Sex
                    </Text>
                    <Text style={{ fontSize: 12, color: "#086268" }}>
                      {props.patient.sex}
                    </Text>
                  </View>
                  <View style={{ marginRight: 24 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#6d6c6d",
                        marginBottom: 3,
                      }}
                    >
                      Age
                    </Text>
                    <Text style={{ fontSize: 12, color: "#086268" }}>
                      {props.patient.age}
                    </Text>
                  </View>
                  <View style={{ marginRight: 24 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#6d6c6d",
                        marginBottom: 3,
                      }}
                    >
                      Color
                    </Text>
                    <Text style={{ fontSize: 12, color: "#086268" }}>
                      {props.patient.color}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {props.document.content && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14 }}>{props.document.content}</Text>
              </View>
            )}
          </View>
        </View>
        <Text
          style={{
            color: "#5b5a5b",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {user?.pdf_bottom_page_info}
        </Text>
        {user?.pdf_docuvet_notice && (
          <Text
            style={{
              color: "#9a999a",
              fontSize: 12,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Medical Notes generated with Kreative DocuVet AI.
          </Text>
        )}
      </Page>
    </PdfDocument>
  );

  return (
    <div>
      <Summary summary={props.summary} className="mb-2" />
      <PatientSignalment
        patient={props?.patient}
        patientIcon={props.patientIcon}
        docustreamId={props.docustreamId}
        className="mb-2"
      />
      <div className="rounded-xl bg-white/70 border border-neutrals-4 w-full pt-6 pb-12 px-10">
        <div className="flex items-center justify-between">
          {PatientTag}
          <div className="flex items-center justify-end space-x-0.5 min-[475px]:space-x-1">
            <ScoringPanel
              documentId={props.document.id}
              docustreamId={props.docustreamId}
              score={props.document.score}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="text-neutrals-8"
                    onClick={handleCopy}
                    disabled={props.document.status === "Generating"}
                  >
                    <Copy weight="bold" className="w-4 h-4 text-neutrals-8" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-[140px] p-2 flex items-center justify-center">
                  <p className="text-[14px] text-neutrals-10 font-medium">
                    Copy to clipboard
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="text-neutrals-8"
                    onClick={handleOpenInEmail}
                    disabled={props.document.status === "Generating"}
                  >
                    <PaperPlaneTilt
                      weight="bold"
                      className="w-4 h-4 text-neutrals-8"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-[240px] p-2 flex items-center justify-center">
                  <p className="text-[14px] text-neutrals-10 font-medium text-center">
                    Open this document in your mail client to send
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="text-neutrals-8"
                    disabled={props.document.status === "Generating"}
                  >
                    <PDFDownloadLink
                      document={<Pdf />}
                      fileName={`${props.patient.name}_${props.patient.species}_medical_record.pdf`}
                    >
                      {({ blob, url, loading, error }) => (
                        <FilePdf
                          weight="bold"
                          className="w-4 h-4 text-neutrals-8"
                        />
                      )}
                    </PDFDownloadLink>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-[220px] p-2 flex items-center justify-center">
                  <p className="text-[14px] text-neutrals-10 font-medium">
                    Export this document as PDF
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <BlobProvider document={<Pdf />}>
                    {({ url, blob }) => (
                      <a href={url!} target="_blank">
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          className="text-neutrals-8"
                          disabled={props.document.status === "Generating"}
                        >
                          <Printer
                            weight="bold"
                            className="w-4 h-4 text-neutrals-8"
                          />
                        </Button>
                      </a>
                    )}
                  </BlobProvider>
                </TooltipTrigger>
                <TooltipContent className="w-[160px] p-2 flex items-center justify-center">
                  <p className="text-[14px] text-neutrals-10 font-medium">
                    Print this document
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <DeleteDocumentButton
                    documentId={props.document.id}
                    docustreamId={props.docustreamId}
                    disabled={props.document.status === "Generating"}
                  >
                    <Button
                      variant={"ghost"}
                      size="icon"
                      disabled={props.document.status === "Generating"}
                    >
                      <Trash
                        weight="bold"
                        className="w-4 h-4 text-neutrals-8"
                      />
                    </Button>
                  </DeleteDocumentButton>
                </TooltipTrigger>
                <TooltipContent className="w-[160px] p-2 flex items-center justify-center">
                  <p className="text-[14px] text-neutrals-10 font-medium">
                    Delete this document
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <h2 className="text-2xl text-center font-bold tracking-tight mb-3 sm:mb-6 pt-4 sm:pt-0">
          <span role="img" aria-label="emoji" className="mr-2 text-[1.6rem]">
            {he.decode(props.document.document_type_emoji_icon)}
          </span>
          {props.document.title}
        </h2>
        {props.document.status === "Generating" && (
          <div
            key={"loader"}
            className="flex-col items-center justify-center -mt-20"
          >
            <Player src="/orb.json" className="w-3/4 h-auto" loop autoplay />
            <p className="text-center -mt-20 text-neutrals-7">
              DocuVet AI is working on your document... <br />
              Check back in a couple seconds...
            </p>
          </div>
        )}
        {props.document.status === "Completed" && docContent && (
          <Tiptap
            key={"tiptap"}
            content={getHTML(docContent!)}
            onChange={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
