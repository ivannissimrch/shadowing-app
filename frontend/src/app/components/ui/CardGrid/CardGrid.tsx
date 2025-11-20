import { ReactNode } from "react";
import styles from "./CardGrid.module.css";

interface CardGridProps {
  children: ReactNode;
}

export default function CardGrid({ children }: CardGridProps) {
  return <div className={styles.grid}>{children}</div>;
}
