"use client";

import { useAuthContext } from "../AuthContext";
import Header from "../components/layout/Header";
import TeacherHeader from "../components/layout/TeacherHeader";
import Footer from "../components/layout/Footer";
import styles from "../student/layout.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (token === null) {
      router.push("/");
    }
  }, [token, router]);

  if (!token) return null;
  else {
    const user = JSON.parse(atob(token.split(".")[1]));

    return (
      <>
        {user?.role === "teacher" ? <TeacherHeader /> : <Header />}
        <main className={styles.container}>{children}</main>
        <Footer />
      </>
    );
  }
}
