"use client";

import { DashboardLayout } from "../components/layout/dashboard";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout userType="student">
      {children}
    </DashboardLayout>
  );
}
