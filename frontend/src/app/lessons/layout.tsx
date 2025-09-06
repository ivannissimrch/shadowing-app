import Header from "../components/Header";
import Footer from "../components/Footer";
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
