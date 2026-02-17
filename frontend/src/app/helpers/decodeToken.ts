interface TokenPayload {
  id: string;
  username: string;
  role: "teacher" | "student";
}

export default function decodeToken(token: string): TokenPayload {
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
}
