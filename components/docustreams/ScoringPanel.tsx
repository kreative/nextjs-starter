import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { ThumbsDown, ThumbsUp } from "@phosphor-icons/react/dist/ssr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addScoreForDocument } from "@/lib/documents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Spinner } from "../ui/spinner";

interface ScoringPanelProps {
  docustreamId: number;
  documentId: number;
  score?: number;
  disabled?: boolean;
}

export default function ScoringPanel(props: ScoringPanelProps) {
  const [currentScore, setCurrentScore] = useState(props.score);
  const [thumbsDownOpen, setThumbsDownOpen] = useState(false);
  const [thumbsUpOpen, setThumbsUpOpen] = useState(false);
  const [negativeFeedback, setNegativeFeedback] = useState("");
  const [positiveFeedback, setPositiveFeedback] = useState("");
  const [cookies] = useCookies(["kreative_id_key"]);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (score: number) => {
      const feedback = score === 1 ? positiveFeedback : negativeFeedback;

      await addScoreForDocument(
        cookies.kreative_id_key,
        props.documentId,
        score,
        feedback,
      );

      return score;
    },
    onSuccess: (score: number) => {
      setCurrentScore(score);
      queryClient.invalidateQueries({
        queryKey: ["docustreams", props.docustreamId, "documents"],
      });
      if (score === 0) {
        setNegativeFeedback("");
        setThumbsDownOpen(false);
      } else {
        setPositiveFeedback("");
        setThumbsUpOpen(false);
      }
    },
  });

  return (
    <div className="flex items-center space-x-1">
      <Popover open={thumbsDownOpen} onOpenChange={setThumbsDownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="text-neutrals-8"
            disabled={props.disabled}
          >
            <ThumbsDown
              weight={currentScore === 0 ? "fill" : "bold"}
              className="w-4 h-4 text-neutrals-8"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-80 drop-shadow-lg">
          <p className="font-bold text-neutrals-10">What went wrong?</p>
          <p className="text-sm text-neutrals-8 mb-4">
            Your feedback directly helps us build a product that empowers
            veterinarians everywhere.
          </p>
          <AutosizeTextarea
            value={negativeFeedback}
            placeholder="The issue was... (optional)"
            className="text-sm rounded-md focus-visible:ring-0 mb-3"
            onChange={(e) => setNegativeFeedback(e.target.value)}
          />
          <Button
            onClick={async () => await mutateAsync(0)}
            className="w-full hover:drop-shadow-md"
            animated
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Spinner size="small" className="text-white" />
                <span className="ml-2">Submitting...</span>
              </div>
            ) : (
              "Submit rating"
            )}
          </Button>
        </PopoverContent>
      </Popover>
      <Popover open={thumbsUpOpen} onOpenChange={setThumbsUpOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="text-neutrals-8"
            disabled={props.disabled}
          >
            <ThumbsUp
              weight={currentScore === 1 ? "fill" : "bold"}
              className="w-4 h-4 text-neutrals-8"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-80 drop-shadow-lg">
          <p className="font-bold text-neutrals-10">What went well?</p>
          <p className="text-sm text-neutrals-8 mb-4">
            Your feedback directly helps us build a product that empower
            veterinarians everywhere.
          </p>
          <AutosizeTextarea
            value={positiveFeedback}
            placeholder="I liked how... (optional)"
            className="text-sm rounded-md focus-visible:ring-0 mb-3"
            onChange={(e) => setPositiveFeedback(e.target.value)}
          />
          <Button
            onClick={async () => await mutateAsync(1)}
            className="w-full hover:drop-shadow-md"
            animated
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <Spinner size="small" className="text-white" />
                <span className="ml-2">Submitting...</span>
              </div>
            ) : (
              "Submit rating"
            )}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}