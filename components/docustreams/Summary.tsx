import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkle, Copy } from "@phosphor-icons/react/dist/ssr";

export default function Summary(props: {
  summary?: string;
  className?: string;
}) {
  const [hasMouse, setHasMouse] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(props.summary || "");
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-white/70 border border-neutrals-4 w-full px-5 py-3",
        props.className
      )}
      onMouseEnter={() => setHasMouse(true)}
      onMouseLeave={() => setHasMouse(false)}
    >
      <div className="flex items-center justify-between pb-1">
        <div className="flex justify-start items-center text-brand-deepocean">
          <Sparkle size={15} weight="bold" className="mr-1.5" />
          <p className="text-sm font-medium">Summary</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label="Copy Summary"
          className={`${
            hasMouse ? "opacity-100" : "opacity-0"
          } transition-opacity ease-in-out delay-0 duration-300`}
        >
          <Copy size={15} weight="bold" className="text-neutrals-8" />
        </Button>
      </div>
      <p className="font-medium tracking-tight text-md">
        {props.summary && props.summary !== "" && props.summary !== "NA" ? (
          props.summary
        ) : (
          <p className="text-neutrals-10 italic">
            Unavailable for this Docustream
          </p>
        )}
      </p>
    </div>
  );
}
