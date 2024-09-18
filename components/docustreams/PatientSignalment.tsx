import _ from "lodash";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import IPatientSignalment from "@/types/IPatientSignalment";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Stethoscope,
  HandWaving,
  Dog,
  Horse,
  Cat,
  Asterisk,
  CalendarBlank,
  PaintBrush,
  GenderFemale,
  GenderMale,
  Tag,
  Copy,
} from "@phosphor-icons/react/dist/ssr";
import { updateDocuStream } from "@/lib/docustreams";
import { useCookies } from "react-cookie";
import { useQueryClient } from "@tanstack/react-query";

interface PatientSignalmentProps {
  docustreamId: number;
  className?: string;
  patient: IPatientSignalment;
  patientIcon: number;
}

export default function PatientSignalment(props: PatientSignalmentProps) {
  const { toast } = useToast();
  const [cookies] = useCookies(["kreative_id_key"]);
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<IPatientSignalment | undefined>(
    props.patient
  );

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const labelStyle = "font-regular text-sm sm:text-xs tracking-tight";
  const valueStyle = "text-seafoam-700 text-lg sm:text-md";
  const inputStyle =
    "p-0 rounded-0 border-transparent bg-transparent focus-visible:border-transparent focus-visible:ring-0 mb-0 w-full h-auto";
  const containerStyle =
    "w-full border-b-[1.5px] border-b-seafoam-700 text-seafoam-700 flex items-center justify-start";

  const speciesIcon = (species: string) => {
    switch (species) {
      case "Canine":
        return <Dog size="15" weight="bold" className="mr-1" />;
      case "Feline":
        return <Cat size="15" weight="bold" className="mr-1" />;
      case "Equine":
        return <Horse size="15" weight="bold" className="mr-1" />;
      default:
        return <Asterisk size="15" weight="bold" className="mr-1" />;
    }
  };

  const sexIcon = (sex: string) => {
    if (sex.toLowerCase().includes("female")) {
      return <GenderFemale size="15" weight="bold" className="mr-1" />;
    } else if (sex.toLowerCase().includes("male")) {
      return <GenderMale size="15" weight="bold" className="mr-1" />;
    } else {
      return <Asterisk size="15" weight="bold" className="mr-1" />;
    }
  };

  const handleCopy = () => {
    let text = "";

    text += `Name: ${patient?.name}\n`;
    text += `Species: ${patient?.species}\n`;
    text += `Breed: ${patient?.breed}\n`;
    text += `Sex: ${patient?.sex}\n`;
    text += `Age: ${patient?.age}\n`;
    text += `Color: ${patient?.color}\n`;

    navigator.clipboard.writeText(text);

    toast({
      title: "Copied to clipboard",
      description: "Patient signalment copied to clipboard",
    });
  };

  const handleEdit = async (data: any) => {
    setIsLoading(true);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(async () => {
      await updateDocuStream({
        id: props.docustreamId,
        key: cookies.kreative_id_key,
        data,
      });
    }, 1000);

    queryClient.invalidateQueries({
      queryKey: ["docustream", props.docustreamId],
    });

    setIsLoading(false);
  };

  if (!patient) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-white/70 border border-neutrals-4 w-full px-5 pt-3 pb-5",
        props.className
      )}
    >
      <div className="flex items-center justify-between pb-2">
        <div className="flex justify-start items-center text-brand-deepocean">
          <Stethoscope size={15} weight="bold" className="mr-1.5" />
          <p className="text-sm font-medium">Patient Signalment</p>
        </div>
        <div className="flex items-center justify-end space-x-1">
          {isLoading && <Spinner size={"xxs"} className="text-seafoam-700" />}
          <Button size="icon" variant="ghost" onClick={handleCopy}>
            <Copy size={15} weight="bold" className="text-neutrals-8" />
          </Button>
        </div>
      </div>
      <div className="font-medium tracking-tight text-md grid grid-cols-2 min-[770px]:grid-cols-3 gap-x-6 gap-y-4">
        <div>
          <p className={labelStyle}>Name</p>
          <p className={containerStyle}>
            <HandWaving size="15" weight="bold" className="mr-1" />
            <Input
              className={cn(valueStyle, inputStyle)}
              value={patient.name}
              onChange={async (e) => {
                setPatient({
                  ...patient,
                  name: e.target.value,
                });

                await handleEdit({
                  patient_name: e.target.value,
                });
              }}
            />
          </p>
        </div>
        <div>
          <p className={labelStyle}>Species</p>
          <p className={containerStyle}>
            {speciesIcon(patient.species)}
            <Input
              className={cn(valueStyle, inputStyle)}
              value={patient.species}
              onChange={async (e) => {
                setPatient({
                  ...patient,
                  species: e.target.value,
                });

                await handleEdit({
                  patient_species: e.target.value,
                });
              }}
            />
          </p>
        </div>
        <div>
          <p className={labelStyle}>Breed</p>
          <p className={containerStyle}>
            <Tag size="15" weight="bold" className="mr-1" />
            <Input
              className={cn(valueStyle, inputStyle)}
              value={patient.breed}
              onChange={async (e) => {
                setPatient({
                  ...patient,
                  breed: e.target.value,
                });
                
                await handleEdit({
                  patient_breed: e.target.value,
                });
              }}
            />
          </p>
        </div>
        <div>
          <p className={labelStyle}>Sex</p>
          <p className={containerStyle}>
            {sexIcon(patient.sex)}
            <Input
              className={cn(valueStyle, inputStyle)}
              value={patient.sex}
              onChange={async (e) => {
                setPatient({
                  ...patient,
                  sex: e.target.value,
                });

                await handleEdit({
                  patient_sex: e.target.value,
                });
              }}
            />
          </p>
        </div>
        <div>
          <p className={labelStyle}>Age</p>
          <p className={containerStyle}>
            <CalendarBlank size="15" weight="bold" className="mr-1" />
            <Input
              className={cn(valueStyle, inputStyle)}
              value={patient.age}
              onChange={async (e) => {
                setPatient({
                  ...patient,
                  age: e.target.value,
                });

                await handleEdit({
                  patient_age: e.target.value,
                });
              }}
            />
          </p>
        </div>
        <div>
          <p className={labelStyle}>Color</p>
          <p className={containerStyle}>
            <PaintBrush size="15" weight="bold" className="mr-1" />
            <Input
              className={cn(valueStyle, inputStyle)}
              value={patient.color}
              onChange={async (e) => {
                setPatient({
                  ...patient,
                  color: e.target.value,
                });

                await handleEdit({
                  patient_color: e.target.value,
                });
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
