import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowSpeak with Lynnex English",
  description: "English Pronunciation Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
