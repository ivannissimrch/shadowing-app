import AppFonts from "../../AppFonts";

export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppFonts />
      {children}
    </>
  );
}
