import { atom } from "jotai";
import IAccount from "@/types/IAccount";

const accountStore = atom({} as IAccount);

export { accountStore };
