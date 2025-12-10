"use client";
import { useAuthContext } from "../../AuthContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { token } = useAuthContext();

  if (!token) {
    return <></>;
  }
  return (
    <footer className={styles.footer}>
      <div>
        <p>
          &copy; {new Date().getFullYear()} ShadowSpeak. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
