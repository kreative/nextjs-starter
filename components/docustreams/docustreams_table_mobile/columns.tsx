import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import IDocuStream from "@/types/IDocuStream";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowsDownUp } from "@phosphor-icons/react/dist/ssr";
import { DSAudioFile } from "@/components/svgs/ds-audiofile";

function getFormattedMinutes(minutes: number): string {
  if (minutes < 10) {
    return `0${minutes}`;
  }
  return minutes.toString();
}

export const columns: ColumnDef<IDocuStream>[] = [
  {
    accessorKey: "title",
    sortingFn: (a, b) => {
      // compare dates
      return (
        new Date(a.original.start_time).getTime() -
        new Date(b.original.start_time).getTime()
      );
    },
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            Title and timestamps
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const docustream = row.original;
      const start_time = new Date(docustream.start_time);
      const hours = start_time.getHours();
      const minutes = start_time.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      const hours12 = hours > 12 ? hours - 12 : hours;
      const startTime = `${hours12}:${getFormattedMinutes(minutes)} ${ampm}`;

      const end_time = docustream.time_uploaded;
      let endTime, endHours, endMinutes, endAmpm, endHours12, endTimeFormatted;
      if (end_time) {
        endTime = new Date(end_time);
        endHours = endTime.getHours();
        endMinutes = endTime.getMinutes();
        endAmpm = endHours >= 12 ? "pm" : "am";
        endHours12 = endHours > 12 ? endHours - 12 : endHours;
        endTimeFormatted = `${endHours12}:${getFormattedMinutes(
          endMinutes
        )} ${endAmpm}`;
      }

      const sec = docustream.length;

      return (
        <div className="flex justify-start items-center space-x-2.5">
          <Image
            src={"/ds-audiofile.webp"}
            alt="audio file"
            width={30}
            height={30}
            className="w-full h-auto max-w-[42px] drop-shadow-md"
          />
          <div className="flex flex-col flex-wrap">
            <h3 className="text-neutrals-13 font-bold text-[17px] tracking-tight pb-0.5 flex items-center justify-start">
              {docustream.title}
              {docustream.status === "Generating" && (
                <Spinner size="xs" className="text-brand-forrest ml-2" />
              )}
            </h3>
            <p className="text-neutrals-7 font-medium text-[15px]">
              <span className="text-neutrals-13">{startTime}</span>{" "}
              {end_time && (
                <span>
                  → <span className="text-neutrals-13">{endTimeFormatted}</span>
                </span>
              )}{" "}
              {sec && (
                <span>
                  ·{" "}
                  <span className="text-neutrals-13">{`
                    ${Math.floor(sec / 60)}m ${sec % 60}s
                  `}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      );
    },
  },
];
