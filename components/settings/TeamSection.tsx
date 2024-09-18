import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog2";
import { useToast } from "@/components/ui/use-toast";
import { CrownSimple, DotsThree } from "@phosphor-icons/react/dist/ssr";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getAccountList, removeUser } from "@/lib/users";
import { useAtom } from "jotai";
import { accountStore } from "@/stores/account";
import TableSkeleton from "@/components/TableSkeleton";
import Table from "@/components/Table";
import IAccount from "@/types/IAccount";
import IAccountRole from "@/types/IAccountRole";
import EditRoleForm from "@/components/settings/EditRoleForm";

interface TeamSectionProps {
  isAdmin: boolean;
  isSubscribed: boolean;
}

interface DropdownMenuProps {
  ksn: number;
  email: string;
  isSelf: boolean;
  role: string;
  isAdmin: boolean;
  name: string;
  isSubscribed: boolean;
}

export default function TeamSection(props: TeamSectionProps) {
  const [cookies] = useCookies(["kreative_id_key"]);
  const [account] = useAtom(accountStore);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const data = await getAccountList({
        key: cookies.kreative_id_key,
      });

      let users: any[] = [];

      data.users.forEach((user: IAccount) => {
        const labels: any[] = [];
        let userIsAdmin = false;
        let userRole = "nonprovider";

        user.roles.forEach((role: IAccountRole) => {
          if (role.rid === "DOCUVET_ORG_ADMIN") {
            userIsAdmin = true;
            labels.unshift({
              icon: (
                <CrownSimple className="h-4 w-4 text-[#CA7428]" weight="bold" />
              ),
              label: "Admin",
              color: "bg-[#CA7428]/15 text-[#CA7428]",
            });
          }
          if (role.rid === "DOCUVET_PROVIDER") {
            userRole = "provider";
            labels.push({
              icon: null,
              label: "Provider",
              color: "bg-seafoam-50 text-brand-forrest",
            });
          }
          if (role.rid === "DOCUVET_NONPROVIDER") {
            labels.push({
              icon: null,
              label: "Nonprovider",
              color: "bg-medicalblue-50 text-brand-deepocean",
            });
          }
        });

        const newUser = {
          ksn: user.ksn,
          avatar_url: user.profilePicture,
          mainText: `${user.firstName} ${user.lastName}`,
          supportingText: user.email,
          labels,
          userIsAdmin,
          userRole,
        };

        if (user.ksn === account.ksn) users.unshift(newUser);
        else users.push(newUser);
      });

      return users;
    },
  });

  const removeMember = useMutation({
    mutationFn: async ({ ksn, email }: { ksn: number; email: string }) => {
      return await removeUser({ ksn, email, key: cookies.kreative_id_key });
    },
    onError: (error) => {
      console.log("there is an error");
      console.log(error);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["team"] }).then(() => {
        toast({
          title: "Member removed",
          description: "Your clinics users and billing have been updated.",
        });
      });
    },
  });

  function TheDropdownMenu(props: DropdownMenuProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
      <div>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild disabled={!props.isAdmin}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsThree className="h-5 w-5" weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Manage user</DropdownMenuLabel>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  setDialogOpen(true);
                }}
              >
                Edit roles
              </DropdownMenuItem>
              {props.isSelf ? null : (
                <DropdownMenuItem
                  onClick={async () => {
                    toast({
                      title: "Removing user...",
                      description: "We'll ping you in a sec when we're done!",
                    });
                    await removeMember.mutateAsync({
                      ksn: props.ksn,
                      email: props.email,
                    });
                  }}
                  className="hover:cursor-pointer"
                >
                  <span className="text-red-600 font-medium">Remove user</span>
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">
                Edit roles for {props.name}
              </DialogTitle>
              <DialogDescription className="text-left">
                Providers count towards licenses you&apos;re billed for. Admins
                have full access to manage your clinic details, billing, and
                note types.
              </DialogDescription>
              {props.isSelf && (
                <DialogDescription className="italic text-left">
                  Since you&apos;re an admin, you cannot remove yourself as an
                  administrator. Please submit a request with our team with the
                  chat in the bottom right.
                </DialogDescription>
              )}
            </DialogHeader>
            <EditRoleForm
              ksn={props.ksn}
              email={props.email}
              isSelf={props.isSelf}
              isAdmin={props.isAdmin ? "yes" : "no"}
              role={props.role as "nonprovider" | "provider"}
              invalidate={() => {
                queryClient.invalidateQueries({ queryKey: ["team"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <h2 className="pb-2 text-2xl font-bold tracking-tight mb-6">Your team</h2>
      {isPending && <TableSkeleton count={5} />}
      {isSuccess && (
        <Table
          pagination={false}
          items={data?.map((user: any) => ({
            avatar_url: user.avatar_url,
            mainText: user.mainText,
            supportingText: user.supportingText,
            labels: user.labels,
            rightComponent: (
              <TheDropdownMenu
                ksn={user.ksn}
                email={user.supportingText}
                isSelf={user.ksn === account.ksn}
                name={user.mainText}
                role={user.userRole}
                isAdmin={props.isAdmin}
                isSubscribed={props.isSubscribed}
              />
            ),
          }))}
        />
      )}
    </div>
  );
}
