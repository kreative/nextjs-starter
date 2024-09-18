import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RenderTranscriptProps {
  docustreamId: number;
  transcript: string;
}

export default function RenderTranscript(props: RenderTranscriptProps) {
  if (props.transcript === "No audio transcript available") {
    return <p className="text-neutrals-8 italic">{props.transcript}</p>;
  }

  const displayTranscript = props.transcript
    .split("\n")
    .map((str: string, index: number) => (
      <p key={index}>{str.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")}</p>
    ));

  return displayTranscript;
}
