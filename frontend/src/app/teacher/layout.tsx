import Footer from "../components/layout/Footer";
import TeacherHeader from "../components/layout/TeacherHeader";
import styles from "./layout.module.css";

export default function LessonsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TeacherHeader />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </>
  );
}
