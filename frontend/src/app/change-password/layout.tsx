"use client";

import { useAuthContext } from "../AuthContext";
import { DashboardLayout } from "../components/layout/dashboard";

export default function ChangePasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAuthContext();

  // Determine user type from JWT token
  let userType: "teacher" | "student" = "student";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userType = payload?.role === "teacher" ? "teacher" : "student";
    } catch {
      // Default to student if token parsing fails
    }
  }

  return (
    <DashboardLayout userType={userType}>
      {children}
    </DashboardLayout>
  );
}
