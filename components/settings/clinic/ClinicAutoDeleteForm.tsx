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
import { Checkbox } from "@/components/ui/checkbox";
import { updateAudioFileTtl } from "@/lib/clinics";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useCookies } from "react-cookie";

interface AutoDeleteFormProps {
  ksn: number;
  currentTtl: number;
  currentIsOverriding: boolean;
  className?: string;
  isAdmin: boolean;
}

export default function ClinicAutoDeleteForm(props: AutoDeleteFormProps) {
  const queryClient = useQueryClient();
  const [ttl, setTtl] = useState(props.currentTtl);
  const [isOverriding, setIsOverriding] = useState<CheckedState>(props.currentIsOverriding);
  const { toast } = useToast();
  const [cookies] = useCookies(["kreative_id_key"]);

  const mutation = useMutation({
    mutationFn: async (ttl: number | null) => {
      const audio_file_ttl = ttl === null ? 18250 : ttl;

      return await updateAudioFileTtl({
        key: cookies.kreative_id_key,
        audio_file_ttl: audio_file_ttl,
        is_overriding: isOverriding,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic", props.ksn] });
      toast({
        title: "Clinic override schedule updated",
        description: "The auto-delete schedule has been updated.",
      });
    },
  });

  return (
    <div className={props.className}>
      <div className="mb-4">
        <Checkbox
          disabled={!props.isAdmin}
          id="is_overriding"
          checked={isOverriding}
          onCheckedChange={(checked) => {
            setIsOverriding(checked);
          }}
        />
        <label
          className="ml-2 font-medium tracking-tight"
          htmlFor="is_overriding"
        >
          Override my clinic&apos;s audio file auto-delete schedule?
        </label>
      </div>
      <p className="mt-4 mb-2 font-medium text-brand-forrest">
        Delete audio files after...
      </p>
      <Select
        disabled={!isOverriding || !props.isAdmin}
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
          disabled={
            mutation.isPending ||
            !props.isAdmin ||
            (isOverriding === props.currentIsOverriding &&
              ttl === props.currentTtl)
          }
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
