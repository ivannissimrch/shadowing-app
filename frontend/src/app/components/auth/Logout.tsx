"use client";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import { Button } from "../ui/Button";
import styles from "./Logout.module.css";

export default function Logout() {
  const { updateToken } = useAppContext();
  const router = useRouter();

  function handleLogout() {
    updateToken(null);
    router.push("/");
  }

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      className={styles.logoutButton}
    >
      Logout
    </Button>
  );
}
