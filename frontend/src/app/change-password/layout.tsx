"use client";

import { useAppContext } from "../AppContext";
import Header from "../components/layout/Header";
import TeacherHeader from "../components/layout/TeacherHeader";
import Footer from "../components/layout/Footer";
import styles from "../lessons/layout.module.css";

export default function ChangePasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAppContext();

  if (!token) return null;
  const user = JSON.parse(atob(token.split(".")[1]));

  return (
    <>
      {user?.role === "teacher" ? <TeacherHeader /> : <Header />}
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}
