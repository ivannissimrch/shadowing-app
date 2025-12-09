"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAppContext } from "../AppContext";
import styles from "./layout.module.css";

export default function LessonsLayout({
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
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}
