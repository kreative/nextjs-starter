import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter, DialogClose } from "@/components/ui/dialog2";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { replaceRolesForUser } from "@/lib/roles";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

interface EditRoleFormProps {
  ksn: number;
  email: string;
  role: "nonprovider" | "provider";
  isAdmin: "yes" | "no";
  isSelf: boolean;
  invalidate: () => void;
}

const RoleFormSchema = z.object({
  role: z.enum(["nonprovider", "provider"], {
    required_error: "You need to select a role for this user.",
  }),
  isAdmin: z.enum(["yes", "no"], {
    required_error: "You need select whether this user is an admin.",
  }),
});

export default function EditRoleForm(props: EditRoleFormProps) {
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const roleForm = useForm<z.infer<typeof RoleFormSchema>>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      role: props.role,
      isAdmin: props.isAdmin,
    },
  });

  async function onRoleFormSubmit(data: z.infer<typeof RoleFormSchema>) {
    // if the button can be clicked, then we need to assume that one of the radio groups has a change
    // but we don't know which one yet.
    // if the user is not an admin, we need to replace the role (if it exists)
    // if the user is an admin, we need to ensure we add that role (if it doesn't exist)
    // for whatever the role is, we need to remove the opposite and add the one that is now selected

    const oldRoles = [];
    const newRoles = [];

    if (data.isAdmin === "yes") newRoles.push("DOCUVET_ORG_ADMIN");
    else oldRoles.push("DOCUVET_ORG_ADMIN");

    if (data.role === "provider") {
      newRoles.push("DOCUVET_PROVIDER");
      oldRoles.push("DOCUVET_NONPROVIDER");
    } else if (data.role === "nonprovider") {
      newRoles.push("DOCUVET_NONPROVIDER");
      oldRoles.push("DOCUVET_PROVIDER");
    }

    await replaceRolesForUser({
      ksn: props.ksn,
      email: props.email,
      key: cookies.kreative_id_key,
      newRoles,
      oldRoles,
    });

    queryClient.invalidateQueries({ queryKey: ["team"] }).then(() => {
      toast({
        title: "Roles updated successfully",
        description: `The roles for this user have been updated.`,
      });

      setTimeout(() => {
        document.getElementById("edit_roles_close_btn")?.click();
      }, 300);
    });
  }

  return (
    <Form {...roleForm}>
      <form
        onSubmit={roleForm.handleSubmit(onRoleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
          <FormField
            control={roleForm.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What type of user is this?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="nonprovider" />
                      </FormControl>
                      <FormLabel className="font-normal">Nonprovider</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="provider" />
                      </FormControl>
                      <FormLabel className="font-normal">Provider</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={roleForm.control}
            name="isAdmin"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is this user an administrator?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={props.isSelf}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogClose id="edit_roles_close_btn" asChild className="w-full mt-2 sm:w-auto sm:mt-0">
            <Button type="button" variant="secondary" animated>
              Close
            </Button>
          </DialogClose>
          <Button disabled={!roleForm.formState.isDirty} type="submit" animated>
            {roleForm.formState.isSubmitting ? (
              <div className="flex justify-center items-center space-x-3">
                <motion.span
                  className="flex items-center w-5 h-5 border-2 border-white border-t-brand-forrest rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  role="status"
                />
                <span>Updating</span>
              </div>
            ) : (
              "Update roles"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
