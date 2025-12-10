import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContextProvider from "./AuthContext";
import AlertContextProvider from "./AlertContext";
import AlertDialog from "./components/ui/AlertDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lynnex ESL",
  description: "English Pronunciation Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthContextProvider>
          <AlertContextProvider>
            {children}
            <AlertDialog />
          </AlertContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
