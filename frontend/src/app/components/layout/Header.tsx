"use client";
import { useAppContext } from "../../AppContext";
import Logout from "../auth/Logout";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { token } = useAppContext();
  const pathname = usePathname();

  if (!token) {
    return null;
  }
  return (
    <header className={styles.header}>
      <div>
        <h1>ShadowSpeak</h1>
      </div>
      <div>
        {pathname.startsWith("/lessons") && (
          <Link
            href="/lessons"
            className={`${styles.link} ${
              pathname === "/lessons" ? styles.active : ""
            }`}
          >
            Lessons
          </Link>
        )}
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
