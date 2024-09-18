import _ from "lodash";
import { useEffect, useState } from "react";
import Authenticate from "@/components/Authenticate";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import { clinicStore } from "@/stores/clinic";
import { providerFilterStore } from "@/stores/providerFilter";
import { useCookies } from "react-cookie";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import DocuStreamsTable from "@/components/docustreams/docustreams_table/DocuStreamsTable";
import { default as MobileDSTable } from "@/components/docustreams/docustreams_table_mobile/DocuStreamsTable";
import {
  getDocuStreamsForClinic,
  getDocuStreamsForProvider,
} from "@/lib/docustreams";
import { getProviders } from "@/lib/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IAccount from "@/types/IAccount";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQueryParam, StringParam, withDefault } from "use-query-params";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import TruncatedText from "@/components/TruncatedText";

function WelcomeMessage({
  firstName,
  lastName,
  prefix,
}: {
  firstName: string;
  lastName: string;
  prefix: string;
}): JSX.Element {
  const date = new Date();
  const hour = date.getHours();

  let message = "";

  const name = prefix === "Dr." ? `Dr. ${lastName}` : firstName;

  if (0 < hour && hour < 12) {
    message = `Good morning, ${name} 👋⛅`;
  } else if (12 <= hour && hour < 18) {
    message = `Good afternoon, ${name} 👋☀️`;
  } else if (18 <= hour && hour < 21) {
    message = `Good evening, ${name} 👋🌙`;
  } else {
    message = `Welcome, ${name} 👋`;
  }

  return <p className="text-xl font-medium">{message}</p>;
}

export default function DocuStreams() {
  const [account] = useAtom(accountStore);
  const [clinic] = useAtom(clinicStore);
  const [isGenerating, setIsGenerating] = useState(false);
  const [_providerFilter, _setProviderFilter] = useAtom(providerFilterStore);
  const [providerFilter, setProviderFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const [date, setDate] = useState<Date>(new Date());
  const [queryDate, setQueryDate] = useQueryParam(
    "date",
    withDefault(StringParam, "")
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (queryDate) {
      const decoded = decodeURIComponent(queryDate);
      if (new Date(decoded).toString() === "Invalid Date") return;
      setDate(new Date(decoded));
    }
  }, [queryDate]);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["docustreams", providerFilter, date],
    refetchInterval: isGenerating ? 2000 : 60000,
    queryFn: async () => {
      const start = new Date(date! as Date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date! as Date);
      end.setHours(23, 59, 59, 999);

      if (providerFilter === "all") {
        return await getDocuStreamsForClinic({
          key: cookies.kreative_id_key,
          start: start.toISOString(),
          end: end.toISOString(),
        });
      } else {
        return await getDocuStreamsForProvider({
          key: cookies.kreative_id_key,
          ksn: parseInt(providerFilter),
          start: start.toISOString(),
          end: end.toISOString(),
        });
      }
    },
  });

  useEffect(() => {
    if (!data?.docustreams) return;

    const numOfGenerating = _.filter(data?.docustreams, (docustream) => {
      return docustream.status === "Generating";
    }).length;

    if (numOfGenerating === 0) setIsGenerating(false);
    else setIsGenerating(true);
  }, [data?.docustreams]);

  const providers = useQuery({
    queryKey: ["providersList"],
    queryFn: async () => {
      const data = await getProviders({ key: cookies.kreative_id_key });
      return data.providers;
    },
  });

  return (
    <Authenticate permissions={["DOCUVET_SUBSCRIBER"]}>
      <Navbar activeLink="docustreams" gradientType="regular" />
      <div className="pb-24 min-h-screen pt-12">
        <Container>
          <PageHeader>
            <WelcomeMessage
              prefix={account.prefix}
              firstName={account.firstName}
              lastName={account.lastName}
            />
            {_providerFilter.filterValue === "all" && (
              <h1 className="text-3xl font-bold pt-3 tracking-tight">
                DocuStreams across{" "}
                <span>{clinic.name ? clinic.name : "your clinic"}</span>
              </h1>
            )}
            {_providerFilter.filterValue !== "all" && (
              <h1 className="text-3xl font-bold pt-3 tracking-tight">
                DocuStreams for <span>{_providerFilter.provider}</span>
              </h1>
            )}
          </PageHeader>
          <div className="flex items-center justify-end space-x-2">
            {!(providers.isSuccess && providers.data) ? (
              <Skeleton className="w-[200px] h-9" />
            ) : (
              <Select
                defaultValue="all"
                onValueChange={(value) => {
                  if (value === "all") {
                    _setProviderFilter({
                      filterValue: value,
                      provider: "all",
                    });
                    setProviderFilter(value);
                    return;
                  }
                  const p = _.find(providers?.data, (n) => {
                    if (n.ksn === parseInt(value)) {
                      return true;
                    }
                  });
                  const name = `${p.prefix} ${p.firstName} ${p.lastName}`;
                  _setProviderFilter({
                    filterValue: value,
                    provider: value === "all" ? "all" : name,
                  });
                  setProviderFilter(value);
                }}
              >
                <SelectTrigger className="w-[200px] bg-white/70">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All providers</SelectItem>
                  {providers?.data
                    ? (providers?.data || []).map((provider: IAccount) => (
                        <SelectItem
                          key={provider.ksn}
                          value={provider.ksn.toString()}
                        >
                          <div className="flex items-center justify-start gap-2">
                            <Avatar className="w-5 h-5">
                              <AvatarImage
                                src={provider.profilePicture}
                                alt={`${provider.firstName} ${provider.lastName} avatar`}
                              />
                              <AvatarFallback>
                                {provider.firstName.charAt(0)}
                                {provider.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="hidden xs:block">
                              <TruncatedText
                                text={
                                  provider.firstName + " " + provider.lastName
                                }
                                maxLength={13}
                              />
                            </p>
                            <p className="block xs:hidden">
                              <TruncatedText
                                text={
                                  provider.firstName + " " + provider.lastName
                                }
                                maxLength={8}
                              />
                            </p>
                          </div>
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[90px] sm:w-[200px] justify-start text-left font-normal bg-white/70",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <p className="hidden sm:block">
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </p>
                  <p className="block sm:hidden">
                    {date ? format(date, "M/d") : <span>Pick a date</span>}
                  </p>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(value) => {
                    if (value) {
                      setDate(value);
                      setQueryDate(encodeURIComponent(value.toString()));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              size="icon"
              variant="secondary"
              className="min-h-10 min-w-10 bg-white/70"
              onClick={async () => {
                setRefreshing(true);
                queryClient.invalidateQueries({
                  queryKey: ["docustreams", providerFilter, date],
                });
                setTimeout(() => setRefreshing(false), 1000);
              }}
            >
              <ArrowClockwise
                weight="bold"
                className={cn(
                  "h-[1.1rem] w-[1.1rem] text-neutrals-10",
                  refreshing ? "animate-spin" : null
                )}
              />
            </Button>
          </div>
          <div className="hidden sm:block">
            <DocuStreamsTable
              data={data}
              isPending={isPending}
              isSuccess={isSuccess}
              showingActive={true}
            />
          </div>
          <div className="block sm:hidden">
            <MobileDSTable
              data={data}
              isPending={isPending}
              isSuccess={isSuccess}
              showingActive={true}
            />
          </div>
        </Container>
      </div>
    </Authenticate>
  );
}
