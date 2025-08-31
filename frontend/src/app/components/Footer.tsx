"use client";
import { useAppContext } from "../AppContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { token } = useAppContext();

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
