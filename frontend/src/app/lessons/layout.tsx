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
      <section className={styles.container}>{children}</section>
      <Footer />
    </>
  );
}
