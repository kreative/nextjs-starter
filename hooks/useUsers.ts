import ICurrentUser from "@/types/ICurrentUser";
import useRequest from "@/hooks/useRequest";

function useUsers() {
  const { makeRequest } = useRequest();
  const API = process.env.NEXT_PUBLIC_API_URL!;

  // ! every Kreative API needs one route that allows the client to signed in user's
  // ! information - both the user info for the app itself and the account info tied to
  // ! Kreaitve ID. In the event that the user is null (meaning that the user is not
  // ! registered with the app, i.e. pre-onboarding), the method will still return 200.

  const getCurrentUser = async (): Promise<ICurrentUser> => {
    return makeRequest("GET", API + "/api/veterinarians/me");
  };

  return { getCurrentUser };
}

export default useUsers;
