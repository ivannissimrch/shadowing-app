import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// Berry Theme - Roboto font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Berry Theme Provider
import ThemeProvider from "../themes/ThemeProvider";

// App Contexts
import AuthContextProvider from "./AuthContext";
import AlertContextProvider from "./AlertContext";
import AlertDialog from "./components/ui/AlertDialog";

export const metadata: Metadata = {
  title: "ShadowSpeak",
  description: "English Pronunciation Learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "utsclserbw");
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <AuthContextProvider>
            <AlertContextProvider>
              {children}
              <AlertDialog />
            </AlertContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
