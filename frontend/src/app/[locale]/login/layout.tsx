import AppFonts from "../../AppFonts";

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppFonts />
      {children}
    </>
  );
}
