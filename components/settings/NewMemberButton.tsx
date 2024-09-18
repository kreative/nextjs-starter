import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog2";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewInvite } from "@/lib/invites";
import { useCookies } from "react-cookie";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { DialogFooter } from "../ui/dialog";

interface NewMemberButtonProps {
  invalidate: () => void;
  isSubscribed: boolean;
  isAdmin: boolean;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["nonprovider", "provider"], {
    required_error: "You need to select a role for this user.",
  }),
  isAdmin: z.boolean().default(false),
});

export default function NewMemberButton(props: NewMemberButtonProps) {
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await createNewInvite({
        key: cookies.kreative_id_key,
        ...values,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] }).then(() => {
        toast({
          title: "New invite send! 🎉",
          description:
            "They have recieved an email notifying them that they have been invited to join your Clinic.",
        });
        setTimeout(() => {
          setOpen(false);
        }, 300);
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "nonprovider",
      isAdmin: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values);
  }

  useEffect(() => {
    form.reset();
  }, [form, form.formState.isSubmitSuccessful]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={!props.isAdmin}>
          <Button
            variant="ghost"
            className="flex items-center justify-center"
            animated
          >
            <Plus weight="bold" className="mr-2 h-4 w-4" />
            New invite
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-left">Invite a new team member</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <div className="mb-2">
                        <FormLabel htmlFor="firstName">
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="jane.doe@gmail.com" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What kind of user is this?
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nonprovider">Nonprovider</SelectItem>
                        <SelectItem value="provider">Provider</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Adding a new Provider will add a new billable license.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is this user also an Administrator?</FormLabel>
                      <FormDescription>
                        Admins will have full access to modify your Clinic
                        settings.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full text-md"
                  animated
                  fullWidth
                >
                  {form.formState.isSubmitting ? (
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
                      <span>Sending invite...</span>
                    </div>
                  ) : (
                    "Send invite"
                  )}
                </Button>
                <DialogClose className="hidden" id="new_user_close_btn" asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
