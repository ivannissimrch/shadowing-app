import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import styles from "./layout.module.css";

export default function LessonsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}
