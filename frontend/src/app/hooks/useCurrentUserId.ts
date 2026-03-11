import { useAuthContext } from "../AuthContext";

export default function useCurrentUserId() {
  const { token } = useAuthContext();
  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : undefined;
  return currentUserId;
}
