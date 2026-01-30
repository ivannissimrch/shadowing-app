"use client";

import { DashboardLayout } from "../../components/layout/dashboard";
import { useAuthContext } from "../../AuthContext";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAuthContext();

  // Determine user type from token
  const userType = token
    ? (JSON.parse(atob(token.split(".")[1])).role as "teacher" | "student")
    : "student";

  return (
    <DashboardLayout userType={userType}>
      {children}
    </DashboardLayout>
  );
}
