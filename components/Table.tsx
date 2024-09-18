import Image from "next/image";
import { cn } from "@/lib/utils";

interface TableProps {
  items: TableItemProps[];
  pagination: boolean; // TODO: implement pagination props for the tables for Customer / Patient lists
  className?: string;
}

interface TableItemProps {
  avatar_url?: string;
  mainText: string;
  supportingText: string;
  labels?: LabelProps[];
  rightComponent?: JSX.Element;
  onClick?: () => void;
}

interface LabelProps {
  icon: JSX.Element;
  label: string;
  color: string;
}

function Label(props: LabelProps): JSX.Element {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-sm font-medium flex items-center",
        props.color
      )}
    >
      {props.icon && <div className="mr-1.5">{props.icon}</div>}
      <span>{props.label}</span>
    </span>
  );
}

function TableItem(props: TableItemProps): JSX.Element {
  return (
    <div
      className={`py-2 px-4 flex justify-start items-center space-x-2 ${
        props.onClick ? "hover:cursor-pointer" : ""
      }`}
      onClick={props.onClick}
    >
      {props.avatar_url && (
        <Image
          src={props.avatar_url}
          alt={`${props.mainText} avatar`}
          className="h-8 w-8 rounded-full mr-1"
          width={24}
          height={24}
        />
      )}
      <div className="flex items-center space-x-2 flex-wrap">
        <h3 className="text-neutrals-13 font-medium text-[16px] tracking-tight">
          {props.mainText}
        </h3>
        <p className="hidden sm:block text-neutrals-8 text-md">
          {props.supportingText}
        </p>
        <div className="hidden sm:flex space-x-1.5 items-center">
          {props.labels?.map((label: LabelProps, index: number) => (
            <Label
              key={index}
              icon={label.icon}
              label={label.label}
              color={label.color}
            />
          ))}
        </div>
      </div>
      <div className="flex-1" />
      {props.rightComponent}
    </div>
  );
}

export default function Table(props: TableProps): JSX.Element {
  return (
    <div
      className={cn(
        "border border-neutrals-5 bg-white rounded-xl divide-y",
        props.className
      )}
    >
      {props.items.map((item, index) => (
        <TableItem key={index} {...item} />
      ))}
    </div>
  );
}
