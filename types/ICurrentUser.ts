import IAccount from "@/types/IAccount";
import IUser from "@/types/IUser";

interface ICurrentUser {
  account: IAccount;
  user: IUser;
}

export default ICurrentUser;