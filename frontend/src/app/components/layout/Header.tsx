"use client";
import { useAuthContext } from "../../AuthContext";
import Logout from "../auth/Logout";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { token } = useAuthContext();
  const pathname = usePathname();

  if (!token) {
    return null;
  }
  return (
    <header className={styles.header}>
      <div>
        <h1>ShadowSpeak</h1>
      </div>
      <div className={styles.navLinks}>
        <Link
          href="/lessons"
          className={`${styles.link} ${
            pathname === "/lessons" ? styles.active : ""
          }`}
        >
          Lessons
        </Link>
        <Link
          href="/change-password"
          className={`${styles.link} ${
            pathname === "/change-password" ? styles.active : ""
          }`}
        >
          Change Password
        </Link>
      </div>
      <Logout />
    </header>
  );
}
