"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuthContext } from "../AuthContext";
import styles from "./layout.module.css";

export default function LessonsLayout({
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

  return (
    <>
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}
