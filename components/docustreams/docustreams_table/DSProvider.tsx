import _ from "lodash";
import { useQuery } from "@tanstack/react-query";
import { getProviders } from "@/lib/users";
import { useCookies } from "react-cookie";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DSRowRight({
  provider_id,
  className,
  prefix = "by",
  showText = true,
}: {
  provider_id: number;
  className?: string;
  prefix?: string;
  showText?: boolean;
}) {
  const [cookies] = useCookies(["kreative_id_key"]);

  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const data = await getProviders({ key: cookies.kreative_id_key });
      return _.keyBy(data.providers, "ksn");
    },
  });

  if (isPending) {
    return <Skeleton className="w-12 h-3" />;
  }

  if (isSuccess && data) {
    const provider = data[provider_id];

    if (!provider) {
      return (
        <div className={className}>
          <div className="text-neutrals-8">No provider</div>
        </div>
      );
    }

    return (
      <div className={className}>
        <div className="flex items-center space-x-2 text-neutrals-8">
          <span>{prefix}</span>
          <div className="flex items-center space-x-1.5">
            <Avatar className="h-5 w-5 text-sm">
              <AvatarImage
                src={provider?.profilePicture}
                alt={`${provider?.firstName} ${provider?.lastName} avatar photo`}
              />
              <AvatarFallback>
                {provider.firstName.charAt(0)}
                {provider.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {showText && (
              <span className="text-neutrals-13 font-medium">
                {provider.prefix === "Dr." ? "Dr. " : ""}
                {`${provider.firstName} ${provider.lastName}`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
