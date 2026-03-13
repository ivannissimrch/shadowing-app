import { useAuthContext } from "../AuthContext";

export default function useUserRole(): string | null {
  const { token } = useAuthContext();
  if (!token) {
    return null;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
}
