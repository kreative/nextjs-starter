import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog2";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import {
  updateDocuStream,
  getDocuStreamsForClinic,
  getArchivedDocuStreams,
} from "@/lib/docustreams";
import IDocuStream from "@/types/IDocuStream";
import { motion } from "framer-motion";

interface EditDSButtonProps {
  children: React.ReactNode;
  docustreamId: number;
  queryKey: string[];
  parentCallback?: (docustream: IDocuStream) => void;
}

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function EditDSButton(props: EditDSButtonProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(["kreative_id_key"]);
  const { toast } = useToast();
  const [docustream, setDocustream] = useState<IDocuStream | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: docustream?.title,
    },
  });

  const getDocuStreamFromCache = useCallback(async () => {
    const data: any = await queryClient.ensureQueryData({
      queryKey: props.queryKey,
      queryFn: async () => {
        if (_.isEqual(props.queryKey, ["docustreams", "archived"])) {
          return await getArchivedDocuStreams({
            key: cookies.kreative_id_key,
          });
        } else if (_.isEqual(props.queryKey, ["docustreams"])) {
          return await getDocuStreamsForClinic({
            key: cookies.kreative_id_key,
          });
        }
      },
    });

    if (Array.isArray(data.docustreams)) {
      return data.docustreams.find(
        (docustream: IDocuStream) => docustream.id === props.docustreamId
      );
    } else {
      return data;
    }

  }, [props, queryClient, cookies]);

  useEffect(() => {
    getDocuStreamFromCache().then((_docustream: IDocuStream) => {
      if (docustream !== _docustream) {
        setDocustream(_docustream);
      }
    });
  }, [getDocuStreamFromCache, form, props.docustreamId, docustream]);

  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      return await updateDocuStream({
        key: cookies.kreative_id_key,
        id: props.docustreamId,
        data: {
          title: data.title,
        },
      });
    },
    onSuccess: async (data) => {
      setLoading(true);
      await queryClient.invalidateQueries({ queryKey: ["docustreams"] });

      if (props.parentCallback) {
        props.parentCallback(data.docustream);
      }

      toast({
        title: "DocuStream has been successfully updated! 🎉",
        description: "Everyone at your clinic will see the changes.",
      });
      setOpen(false);
      setLoading(false);
      setTimeout(() => {
        form.reset();
      }, 300);
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className=""
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-left">Edit this DocuStream</DialogTitle>
          <p className="text-neutrals-8 text-sm text-left">
            Note, this will update the DocuStream for all users across your
            clinic.
          </p>
          <DialogClose />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-forrest">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            fullWidth
          >
            {form.formState.isSubmitting || loading ? (
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
                <span>Updating...</span>
              </div>
            ) : (
              "Update DocuStream"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
