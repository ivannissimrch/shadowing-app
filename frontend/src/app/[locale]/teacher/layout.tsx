"use client";

import { DashboardLayout } from "../../components/layout/dashboard";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout userType="teacher">
      {children}
    </DashboardLayout>
  );
}
