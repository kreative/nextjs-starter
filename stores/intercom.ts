import { atom } from "jotai";

interface IIntercomStore {
  userHash: string;
}

const intercomStore = atom({ userHash: "" } as IIntercomStore);

export { intercomStore };
