import { atom } from "jotai";

export interface IUserRolesStore {
  hasBase: boolean;
}

const userRolesStore = atom({
  hasBase: true,
} as IUserRolesStore);

export { userRolesStore };
