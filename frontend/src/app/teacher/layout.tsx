"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/layout/Footer";
import TeacherHeader from "../components/layout/TeacherHeader";
import { useAppContext } from "../AppContext";
import styles from "./layout.module.css";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (token === null) {
      router.push("/");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <>
      <TeacherHeader />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </>
  );
}
