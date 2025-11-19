import styles from "./Button.module.css";
import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "danger" | "secondary" | "ghost";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
}

export function Button({
  variant = "primary",
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  leftIcon,
  rightIcon,
  href,
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

  const content = (
    <>
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.buttonText}>{children}</span>
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
