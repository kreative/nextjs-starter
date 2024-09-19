import ICurrentUser from "@/types/ICurrentUser";

export async function getCurrentUser(): Promise<ICurrentUser> {
  return Promise.resolve({
    user: {
      title: "",
    },
    account: {
      ksn: 1123123,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: "",
      email: "",
      prefix: "",
      firstName: "",
      lastName: "",
      phoneCountryCode: "",
      phoneNumber: "",
      emailVerified: true,
      profilePicture: "",
      walletBalance: 0,
      roles: [
        {
          rid: "",
          ksn: 1123123,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: ""
        },
      ],
    },
  });
}
