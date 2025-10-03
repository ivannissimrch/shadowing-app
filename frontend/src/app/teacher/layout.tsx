import Footer from "../components/Footer";
import TeacherHeader from "../components/TeacherHeader";
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
