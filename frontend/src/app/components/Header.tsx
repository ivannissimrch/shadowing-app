"use client";
import { useAppContext } from "../AppContext";
import Logout from "./Logout";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { token } = useAppContext();
  const pathname = usePathname();

  if (!token) {
    return <></>;
  }
  return (
    <header className={styles.header}>
      <div>
        <h1>ShadowSpeak</h1>
      </div>
      <div>
        <Link
          href="/lessons"
          className={`${styles.link} ${
            pathname === "/lessons" ? styles.active : ""
          }`}
        >
          Lessons
        </Link>
      </div>
      <Logout />
    </header>
  );
}
