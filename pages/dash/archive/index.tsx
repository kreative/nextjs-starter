import Navbar from "@/components/Navbar";
import Authenticate from "@/components/Authenticate";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import DocuStreamsTable from "@/components/docustreams/docustreams_table/DocuStreamsTable";
import { useCookies } from "react-cookie";
import  { useQuery } from "@tanstack/react-query";
import { getArchivedDocuStreams } from "@/lib/docustreams";
import { default as MobileDSTable } from "@/components/docustreams/docustreams_table_mobile/DocuStreamsTable";

export default function ArchivePage() {
  const [cookies] = useCookies(["kreative_id_key"]);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["docustreams", "archived"],
    queryFn: async () => {
      return await getArchivedDocuStreams({
        key: cookies.kreative_id_key,
      });
    },
  });

  return (
    <Authenticate permissions={["DOCUVET_SUBSCRIBER"]}>
      <Navbar activeLink="archive" gradientType="regular" />
      <div className="pb-24 pt-12 min-h-screen">
        <Container>
          <PageHeader>
            <h1 className="text-3xl font-bold pt-3 tracking-tight">
              Your Archive
            </h1>
          </PageHeader>
          <div className="hidden sm:block">
            <DocuStreamsTable
              data={data}
              isPending={isPending}
              isSuccess={isSuccess}
              showingActive={false}
            />
          </div>
          <div className="block sm:hidden">
            <MobileDSTable
              data={data}
              isPending={isPending}
              isSuccess={isSuccess}
              showingActive={false}
            />
          </div>
        </Container>
      </div>
    </Authenticate>
  );
}
