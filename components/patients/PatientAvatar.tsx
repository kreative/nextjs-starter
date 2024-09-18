import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PatientAvatarProps {
  className?: string;
  speciesName: string;
  iconInt?: number;
  key?: number | string;
}

const species = ["canine", "feline", "porcine", "bovine", "caprine", "equine", "ovine", "swine", "murine", "serpentine"];

export default function PatientAvatar(props: PatientAvatarProps) {
  let icon = props.iconInt || 1;
  let speciesName = props.speciesName;

  if (props.speciesName === "Porcine") {
    speciesName = "Swine";
    icon = 3;
  }

  if (speciesName && species.includes(props.speciesName.toLowerCase())) {
    return (
      <Avatar
        key={props.key}
        className={cn("w-6 h-6 text-sm", props.className)}
      >
        <AvatarImage
          src={`/patients/${speciesName.toLowerCase()}/${speciesName.toLowerCase()}_${icon.toString()}.svg`}
          alt={`${speciesName} avatar photo`}
        />
        <AvatarFallback delayMs={300}>{speciesName.slice(0, 1)}</AvatarFallback>
      </Avatar>
    );
  } else {
    return (
      <Avatar key={props.key} className={cn("w-6 h-6 text-sm", props.className)}>
        <AvatarImage
          src="/unknown.svg"
          alt="Unknown avatar photo"
        />
        <AvatarFallback delayMs={300}>?</AvatarFallback>
      </Avatar>
    )
  }
}
