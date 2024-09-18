import { atom } from "jotai";
import IClinic from "@/types/IClinic";

const clinicStore = atom({} as IClinic);

export { clinicStore };
