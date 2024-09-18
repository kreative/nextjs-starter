import { atom } from "jotai";

interface IUserRolesStore {
  hasBase: boolean;
  isProvider: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
}

const userRolesStore = atom({
  hasBase: true,
  isProvider: false,
  isAdmin: false,
  isSubscribed: false,
} as IUserRolesStore);

export { userRolesStore };
