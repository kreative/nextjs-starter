import { cn } from "@/lib/utils";
import { Dot } from "@phosphor-icons/react/dist/ssr";

interface DotStepsProps {
  steps: number;
  currentStep: number;
}

export default function DotSteps(props: DotStepsProps) {
  return (
    <div className="flex items-center justify-center -space-x-2">
      {Array.from({ length: props.steps }, (_, i) => (
        <Dot
          key={i}
          weight="bold"
          className={cn(
            "h-12 w-12",
            i === props.currentStep ? "text-white/100" : "text-white/50"
          )}
        />
      ))}
    </div>
  );
}
