"use client";
import { useAuthContext } from "../../AuthContext";
import { DashboardLayout } from "../../components/layout/dashboard";

export default function ChangePasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAuthContext();

  let userType: "teacher" | "student" = "student";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userType = payload?.role === "teacher" ? "teacher" : "student";
    } catch {}
  }

  return <DashboardLayout userType={userType}>{children}</DashboardLayout>;
}
