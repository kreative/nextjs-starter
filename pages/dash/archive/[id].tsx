import _ from "lodash";
import he from "he";
import { useRouter } from "next/router";
import { useQuery, QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useCookies } from "react-cookie";
import Authenticate from "@/components/Authenticate";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Error from "@/components/Error";
import ApptPageSkeleton from "@/components/docustreams/ApptPageSkeleton";
import DSProvider from "@/components/docustreams/docustreams_table/DSProvider";
import {
  CaretLeft,
  PencilSimpleLine,
  Trash,
  ArrowCounterClockwise,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { getDocuStreamById, updateDocuStream } from "@/lib/docustreams";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs2";
import CalendarIcon from "@/components/CalendarIcon";
import { getMonth } from "@/lib/utils";
import Transcript from "@/components/docustreams/Transcript";
import { useQueryParam, StringParam, withDefault } from "use-query-params";
import EditDSButton from "@/components/docustreams/EditDSButton";
import DeleteDSButton from "@/components/docustreams/DeleteDSButton";
import { getDocustreamDocumentsWithContent } from "@/lib/documents";
import { getDocumentTypes } from "@/lib/document_types";
import IDocument from "@/types/IDocument";
import Document from "@/components/docustreams/Document";
import { Button } from "@/components/ui/button";
import NewDocumentButton from "@/components/docustreams/NewDocumentButton";
import { Spinner } from "@/components/ui/spinner";
import { useCallback, useEffect, useRef, useState } from "react";

function getFormattedMinutes(minutes: number): string {
  if (minutes < 10) {
    return `0${minutes}`;
  }
  return minutes.toString();
}

function ArchivedDocustreamPage(): JSX.Element | undefined {
  const router = useRouter();
  const id = router.query.id;
  const tab = router.query.tab || "transcript";
  const [docsReady, setDocsReady] = useState(true);
  const [cookies] = useCookies(["kreative_id_key"]);
  const queryClient = new QueryClient();
  const [_tab, setTab] = useQueryParam(
    "tab",
    withDefault(StringParam, tab.toString())
  );

  const { isPending, isError, isSuccess, data } = useQuery({
    queryKey: ["docustreams", id],
    queryFn: async () => {
      const response = await getDocuStreamById({
        id: id!.toString(),
        key: cookies.kreative_id_key,
      });

      return response;
    },
  });

  const documentsQuery = useQuery({
    queryKey: ["docustreams", id, "documents"],
    refetchInterval: docsReady ? 60000 : 3000,
    queryFn: async () => {
      return await getDocustreamDocumentsWithContent(
        cookies.kreative_id_key,
        parseInt(id!.toString())
      );
    },
  });

  const documentTypesQuery = useQuery({
    queryKey: ["documentTypes"],
    queryFn: async () => {
      return await getDocumentTypes(cookies.kreative_id_key);
    },
  });

  useEffect(() => {
    if (!documentsQuery.data) return;

    for (const doc of documentsQuery.data.documents) {
      if (doc.status === "Generating") {
        setDocsReady(false);
        return;
      }
    }

    setDocsReady(true);
  }, [documentsQuery?.data]);

  function handleTabChange(tab: string) {
    setTab(tab);
  }

  async function handleEdit() {
    await queryClient.invalidateQueries({ queryKey: ["docustreams", id] });
  }

  function handleDelete() {
    window.location.href = "/dash/archive";
  }

  if (isPending) {
    return <ApptPageSkeleton />;
  }

  if (isError) {
    return <Error />;
  }

  if (isSuccess && data) {
    const start_time = new Date(data.docustream?.start_time);
    const hours = start_time.getHours();
    const minutes = start_time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const hours12 = hours > 12 ? hours - 12 : hours;
    const startTime = `${hours12}:${getFormattedMinutes(minutes)} ${ampm}`;

    const end_time = data.docustream?.time_uploaded;
    let endTime, endHours, endMinutes, endAmpm, endHours12, endTimeFormatted;
    if (end_time) {
      endTime = new Date(end_time);
      endHours = endTime.getHours();
      endMinutes = endTime.getMinutes();
      endAmpm = endHours >= 12 ? "pm" : "am";
      endHours12 = endHours > 12 ? endHours - 12 : endHours;
      endTimeFormatted = `${endHours12}:${getFormattedMinutes(
        endMinutes
      )} ${endAmpm}`;
    }

    const sec = data.docustream?.length;

    return (
      <div>
        {tab && isSuccess && (
          <div>
            <Container>
              <Link
                href="/dash/archive"
                className="text-md text-neutrals-10 flex items-center space-x-2 pt-20 pb-4"
              >
                <CaretLeft size={13} weight="bold" />
                <span>Archive</span>
              </Link>
              <div className="block sm:flex items-center justify-between">
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="pt-2 sm:pt-0">
                    <CalendarIcon
                      month={getMonth(
                        new Date(data.docustream?.start_time).getMonth()
                      ).slice(0, 3)}
                      day={new Date(data.docustream?.start_time).getDate()}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-[26px] font-bold tracking-tight">
                      {data.docustream?.title}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <p className="text-neutrals-7 font-medium text-lg">
                        <span className="text-neutrals-13">{startTime}</span>{" "}
                        {end_time && (
                          <span>
                            →{" "}
                            <span className="text-neutrals-13">
                              {endTimeFormatted}
                            </span>
                          </span>
                        )}{" "}
                        {sec && (
                          <span>
                            ·{" "}
                            <span className="text-neutrals-13">{`
                    ${Math.floor(sec / 60)}m ${sec % 60}s
                  `}</span>
                          </span>
                        )}
                      </p>
                      <DSProvider
                        provider_id={data.docustream.provider_id}
                        showText={false}
                        className="block sm:hidden"
                      />
                      <DSProvider
                        provider_id={data.docustream.provider_id}
                        showText={true}
                        className="hidden sm:block"
                      />
                    </div>
                    <div className="flex sm:hidden space-x-6 flex-wrap text-black/80 text-xl pt-4">
                      <div
                        className="flex justify-start items-center space-x-2.5"
                        onClick={async () => {
                          await updateDocuStream({
                            key: cookies.kreative_id_key,
                            id: parseInt(id!.toString()),
                            data: {
                              is_active: true,
                            },
                          });
                          await queryClient.invalidateQueries({
                            queryKey: ["docustreams"],
                          });

                          window.location.href = `/dash/docustreams/${id}`;
                        }}
                      >
                        <div className="flex items-center justify-center space-x-1 hover:underline hover:cursor-pointer">
                          <ArrowCounterClockwise
                            size={16}
                            className="mr-1"
                            weight={"bold"}
                          />
                          Restore
                        </div>
                      </div>
                      {id && (
                        <div className="text-md flex items-center justify-end space-x-6">
                          <EditDSButton
                            docustreamId={parseInt(id.toString())}
                            queryKey={["docustreams", id.toString()]}
                            parentCallback={handleEdit}
                          >
                            <div className="flex items-center justify-center space-x-1 hover:underline hover:cursor-pointer">
                              <PencilSimpleLine
                                size={16}
                                className="mr-1"
                                weight={"bold"}
                              />
                              Edit
                            </div>
                          </EditDSButton>
                          <DeleteDSButton
                            docustreamId={parseInt(id.toString())}
                            parentCallback={handleDelete}
                            isArchived={true}
                          >
                            <div className="flex items-center justify-center space-x-1 hover:underline hover:cursor-pointer">
                              <Trash
                                size={16}
                                className="mr-1"
                                weight={"bold"}
                              />
                              Delete
                            </div>
                          </DeleteDSButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex space-x-4 flex-wrap text-black/80">
                  <div
                    className="flex justify-start items-center space-x-2.5"
                    onClick={async () => {
                      await updateDocuStream({
                        key: cookies.kreative_id_key,
                        id: parseInt(id!.toString()),
                        data: {
                          is_active: true,
                        },
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["docustreams"],
                      });

                      window.location.href = `/dash/docustreams/${id}`;
                    }}
                  >
                    <div className="flex items-center justify-center space-x-1 hover:underline hover:cursor-pointer">
                      <ArrowCounterClockwise
                        size={16}
                        className="mr-1"
                        weight={"bold"}
                      />
                      Restore
                    </div>
                  </div>
                  {id && (
                    <div className="text-md flex items-center justify-end space-x-4">
                      <EditDSButton
                        docustreamId={parseInt(id.toString())}
                        queryKey={["docustreams", id.toString()]}
                        parentCallback={handleEdit}
                      >
                        <div className="flex items-center justify-center space-x-1 hover:underline hover:cursor-pointer">
                          <PencilSimpleLine
                            size={16}
                            className="mr-1"
                            weight={"bold"}
                          />
                          Edit
                        </div>
                      </EditDSButton>
                      <DeleteDSButton
                        docustreamId={parseInt(id.toString())}
                        parentCallback={handleDelete}
                        isArchived={true}
                      >
                        <div className="flex items-center justify-center space-x-1 hover:underline hover:cursor-pointer">
                          <Trash size={16} className="mr-1" weight={"bold"} />
                          Delete
                        </div>
                      </DeleteDSButton>
                    </div>
                  )}
                </div>
              </div>
            </Container>
            <Tabs defaultValue={tab.toString()} className="w-full block">
              <div className="border-b-2 border-b-black/10 w-full pt-6">
                <Container className="flex items-center justify-start space-x-4">
                  <TabsList className="space-x-3 flex-wrap">
                    <TabsTrigger
                      onClick={() => handleTabChange("transcript")}
                      value="transcript"
                    >
                      Transcript
                    </TabsTrigger>
                    {documentsQuery.isSuccess &&
                      _.sortBy(documentsQuery.data.documents, [
                        function (o) {
                          return new Date(o.created_at);
                        },
                      ]).map((document: IDocument) => (
                        <TabsTrigger
                          className="flex items-center justify-center"
                          key={document.id}
                          onClick={() =>
                            handleTabChange(document.id.toString())
                          }
                          value={document.id.toString()}
                        >
                          {document.status === "Generating" && (
                            <Spinner size="xs" className="text-neutrals-10" />
                          )}
                          <span role="img" aria-label="emoji" className="pr-2">
                            {he.decode(document.document_type_emoji_icon)}
                          </span>
                          {document.title}
                        </TabsTrigger>
                      ))}
                  </TabsList>
                  {documentTypesQuery.isSuccess && (
                    <NewDocumentButton
                      docustreamId={parseInt(id!.toString())}
                      documentTypes={documentTypesQuery.data.document_types}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="-mt-1.5 hover:bg-black/10"
                      >
                        <Plus
                          weight="bold"
                          className="h-4 w-4 text-neutrals-8"
                        />
                      </Button>
                    </NewDocumentButton>
                  )}
                </Container>
              </div>
              <Container className="mt-6">
                <TabsContent value="transcript">
                  <Transcript
                    docustream={data?.docustream}
                    patientName={data.docustream.patient?.name}
                    patientSpecies={data.docustream.patient?.species}
                    patientIcon={parseInt(
                      data.docustream.id.toString().slice(-1)
                    )}
                    docustream_id={data.docustream.id}
                    provider_id={data.docustream.provider_id}
                    hasAudio={!data.docustream.is_audio_deleted}
                    summary={data.docustream.summary}
                  />
                </TabsContent>
                {documentsQuery.isSuccess &&
                  documentsQuery.data.documents.map((doc: IDocument) => (
                    <TabsContent key={doc.id} value={doc.id.toString()}>
                      <Document
                        patient={data.docustream.patient || undefined}
                        patientIcon={parseInt(
                          data.docustream.id.toString().slice(-1)
                        )}
                        docustreamId={data.docustream.id}
                        summary={data.docustream.summary}
                        document={doc}
                      />
                    </TabsContent>
                  ))}
              </Container>
            </Tabs>
          </div>
        )}
        {tab && isPending && <div>Loading</div>}
      </div>
    );
  }
}

export default function SingleDocuStreamPage(): JSX.Element {
  return (
    <Authenticate permissions={["DOCUVET_SUBSCRIBER"]}>
      <div className="bg-blue-gradient bg-cover bg-no-repeat pb-24 min-h-screen">
        <Navbar activeLink="archive" gradientType="regular" />
        <ArchivedDocustreamPage />
      </div>
    </Authenticate>
  );
}
