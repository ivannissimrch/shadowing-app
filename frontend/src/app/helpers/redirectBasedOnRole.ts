export default function redirectBasedOnRole(token: string) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role === "teacher" ? "/teacher" : "/lessons";
}
