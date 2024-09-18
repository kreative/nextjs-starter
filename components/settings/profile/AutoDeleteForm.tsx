import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTtl } from "@/lib/users";
import { useCookies } from "react-cookie";

interface AutoDeleteFormProps {
  ksn: number;
  currentTtl: number;
  className?: string;
}

export default function AutoDeleteForm(props: AutoDeleteFormProps) {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["kreative_id_key"]);
  const [ttl, setTtl] = useState(props.currentTtl);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (ttl: number | null) => {
      const audio_file_ttl = ttl === null ? 18250 : ttl;

      return await updateTtl({
        key: cookies.kreative_id_key,
        ttl: audio_file_ttl,
        ksn: props.ksn,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", props.ksn] });
      toast({
        title: "Auto-delete schedule updated",
        description: "The auto-delete schedule has been updated.",
      });
    },
  });

  return (
    <div className={props.className}>
      <p className="mb-2 font-medium text-brand-forrest">
        Delete audio files after...
      </p>
      <Select
        onValueChange={(value: string) => {
          setTtl(parseInt(value));
        }}
        defaultValue={props.currentTtl.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select how long audio files should live..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 day</SelectItem>
          <SelectItem value="3">3 days</SelectItem>
          <SelectItem value="7">1 week</SelectItem>
          <SelectItem value="14">2 weeks</SelectItem>
          <SelectItem value="30">1 month</SelectItem>
          <SelectItem value="90">3 months</SelectItem>
          <SelectItem value="180">6 months</SelectItem>
          <SelectItem value="365">1 year</SelectItem>
          <SelectItem value="1825">5 years</SelectItem>
          <SelectItem value="18250">Never auto-delete</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex justify-start">
        <Button
          animated
          className="mt-6"
          disabled={mutation.isPending || ttl === props.currentTtl}
          onClick={() => {
            mutation.mutateAsync(ttl);
          }}
        >
          Set auto-delete schedule
        </Button>
      </div>
      {mutation.isError && (
        <p className="text-red-500 mt-4 font-medium">
          There was an error updating your auto-delete schedule, our team has
          been notified. Please try again later.
        </p>
      )}
    </div>
  );
}
