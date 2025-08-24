"use client";
import Link from "next/link";
import { useAppContext } from "../AppContext";
import styles from "./Logout.module.css";

export default function Logout() {
  const { updateToken } = useAppContext();

  function handleLogout() {
    updateToken("");
  }
  return (
    <Link onClick={handleLogout} href="/" className={styles.logoutButton}>
      Logout
    </Link>
  );
}
