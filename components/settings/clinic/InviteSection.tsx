import { useState } from "react";
import NewMemberButton from "../NewMemberButton";
import { Button } from "@/components/ui/button";
import { getClinicInvites, cancelInvite, deleteInvite } from "@/lib/invites";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import TableSkeleton from "@/components/TableSkeleton";
import Table from "@/components/Table";
import {
  X,
  TrashSimple,
} from "@phosphor-icons/react/dist/ssr";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InviteSectionProps {
  isAdmin: boolean;
  isSubscribed: boolean;
}

export default function InviteSection(props: InviteSectionProps) {
  const [cookies] = useCookies(["kreative_id_key"]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      return await getClinicInvites({
        key: cookies.kreative_id_key,
      });
    },
  });

  interface DropdownMenuProps {
    inviteId: string;
    inviteEmail: string;
    status: string;
    isAdmin: boolean;
  }

  function DropDownMenu(props: DropdownMenuProps) {
    const handleCancel = async () => {
      await cancelInvite({
        key: cookies.kreative_id_key,
        inviteId: props.inviteId,
      });

      await queryClient.invalidateQueries({ queryKey: ["invites"] });

      toast({
        title: "Invite cancelled",
        description: `The invite for ${props.inviteEmail} has been successfully cancelled.`,
      });
    };

    const handleDelete = async () => {
      await deleteInvite({
        key: cookies.kreative_id_key,
        inviteId: props.inviteId,
      });

      await queryClient.invalidateQueries({ queryKey: ["invites"] });

      toast({
        title: "Invite deleted",
        description: `The invite for ${props.inviteEmail} has been successfully deleted.`,
      });
    };

    if (props.status === "CANCELLED") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!props.isAdmin}
              variant={"ghost"}
              className="h-8 w-8 p-0 hover:bg-red-100"
              onClick={async () => {
                toast({
                  title: "Deleting invite...",
                  description: "We'll ping you in a sec when we're done!",
                });
                await handleDelete();
              }}
            >
              <TrashSimple
                className="h-5 w-5 text-neutrals-7 hover:text-red-500"
                weight="bold"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      );
    }

    if (props.status === "PENDING") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!props.isAdmin}
              variant={"ghost"}
              className="h-8 w-8 p-0"
              onClick={async () => {
                toast({
                  title: "Cacelling invite...",
                  description: "We'll ping you in a sec when we're done!",
                });
                await handleCancel();
              }}
            >
              <X className="h-5 w-5 text-neutrals-7" weight="bold" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cancel invite</TooltipContent>
        </Tooltip>
      );
    }

    return null;
  }

  function getLabels(invite: any) {
    let labels = [];

    const cancelledColors = "bg-red-100 text-red-600";
    const acceptedColors = "bg-green-50 text-green-500";
    const pendingColors = "bg-neutrals-4 text-neutrals-12";
    const providerColors = "bg-seafom-50 text-brand-forrest";
    const nonproviderColors = "bg-medicalblue-50 text-brand-deepocean";
    const adminColors = "bg-[#CA7428]/15 text-[#CA7428]";

    if (invite.status === "CANCELLED") {
      labels.push({
        label: "Cancelled",
        color: cancelledColors,
      });
    } else if (invite.status === "ACCEPTED") {
      labels.push({
        icon: "",
        label: "Accepted",
        color: acceptedColors,
      });
    } else if (invite.status === "PENDING") {
      labels.push({
        icon: "",
        label: "Pending",
        color: pendingColors,
      });
    }

    if (invite.is_provider) {
      labels.push({
        icon: "",
        label: "Provider",
        color: providerColors,
      });
    } else {
      labels.push({
        icon: "",
        label: "Nonprovider",
        color: nonproviderColors,
      });
    }

    if (props.isAdmin) {
      labels.push({
        icon: "",
        label: "Admin",
        color: adminColors,
      });
    }

    return labels;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="pb-2 text-2xl font-bold tracking-tight">Invites</h2>
        <NewMemberButton
          isAdmin={props.isAdmin}
          isSubscribed={props.isSubscribed}
          invalidate={() => {
            queryClient.invalidateQueries({ queryKey: ["invites"] });
          }}
        />
      </div>
      {isPending && <TableSkeleton count={5} />}
      {isSuccess && data.invites.length > 0 && (
        <Table
          pagination={false}
          items={data?.invites.map((invite: any) => ({
            mainText: invite.invitee_email,
            supportingText: "",
            labels: getLabels(invite),
            rightComponent: (
              <TooltipProvider>
                <DropDownMenu
                  inviteId={invite.id}
                  inviteEmail={invite.invitee_email}
                  status={invite.status}
                  isAdmin={props.isAdmin}
                />
              </TooltipProvider>
            ),
          }))}
        />
      )}
      {isSuccess && data.invites.length === 0 && (
        <div className="flex items-center justify-center py-8 text-neutrals-8">
          No invites have been sent. Invite a new member to join your clinic!
        </div>
      )}
    </div>
  );
}
