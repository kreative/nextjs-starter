import { IUserRolesStore } from "@/stores/userRoles";
import IAccountRole from "@/types/IAccountRole";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BASE_ROLE } from "./constants";
const countryList = require("country-list");

export function getRolesToSet(roles: IAccountRole[]): IUserRolesStore {
  let rolesToSet: IUserRolesStore = { hasBase: false };

  roles.forEach((role: IAccountRole) => {
    switch (role.rid) {
      case BASE_ROLE:
        rolesToSet.hasBase = true;
        break;
    }
  });

  return rolesToSet;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStartAfterEndTime(start: Date, end: Date) {
  if (start > end) {
    return false;
  } else if (start < end) {
    return true;
  } else {
    return false;
  }
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

// get name of day based on number of day
export function getDay(day: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

// return the full name of the month based on the month number
export function getMonth(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
}

export function getReorderedCountriesList() {
  const countries = countryList.getData();

  // Find the indices of the United States and Canada
  const usIndex = countries.findIndex(
    (country: any) => country.name === "United States of America"
  );
  const canadaIndex = countries.findIndex(
    (country: any) => country.name === "Canada"
  );

  // Create a new array with the United States and Canada at the top
  const reorderedCountries = [
    ...(usIndex !== -1 ? [countries[usIndex]] : []),
    ...(canadaIndex !== -1 ? [countries[canadaIndex]] : []),
    ...countries.filter(
      (_: any, index: number) => index !== usIndex && index !== canadaIndex
    ),
  ];

  return reorderedCountries;
}

export async function getTotalAudioDuration(
  audioFiles: File[]
): Promise<number> {
  let duration: number = 0;

  for (const file of audioFiles) {
    const audio = new Audio(URL.createObjectURL(file));

    // Wait for the audio metadata to load
    await new Promise((resolve: any) => {
      audio.addEventListener("loadedmetadata", () => {
        const currentDuration = audio.duration;
        duration += currentDuration;
        resolve();
      });
    });
  }

  return duration;
}

export function getHTML(docContent?: string): string {
  let html = "";

  if (docContent) {
    docContent!.split("\n").forEach((line) => {
      html += `<p>${line}</p>`;
    });
  }

  return html;
}

export function convertTiptapJSONtoText(TiptapJSON: any): string {
  let newContent = "";

  for (let i = 0; i < TiptapJSON.content.length; i++) {
    if (TiptapJSON.content[i].type === "paragraph") {
      if (TiptapJSON.content[i].content !== undefined) {
        newContent += `${TiptapJSON.content[i].content[0].text}\n`;
      } else {
        newContent += "\n";
      }
    }
  }

  return newContent;
}
