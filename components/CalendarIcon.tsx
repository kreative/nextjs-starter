interface CalendarIconProps {
  month: string;
  day: number;
}

export default function CalendarIcon(props: CalendarIconProps) {
  return (
    <div className="border-2 border-[#64BDA3] rounded-xl bg-white">
      <div className="py-[5px] px-[14px] bg-[#64BDA3] text-white text-center font-bold text-[10px] rounded-t-lg">
        {props.month.toUpperCase()}
      </div>
      <div className="text-center font-bold text-lg text-neutrals-10">
        {props.day}
      </div>
    </div>
  );
}
