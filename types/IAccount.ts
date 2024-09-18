import IAccountRole from "@/types/IAccountRole";

interface IAccount {
  ksn: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  prefix: string;
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  emailVerified: boolean;
  profilePicture: string;
  walletBalance: number;
  roles: IAccountRole[];
}

export default IAccount;