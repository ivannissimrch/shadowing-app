import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// Berry Theme Provider
import ThemeProvider from "../../themes/ThemeProvider";

// App Contexts
import { ThemeContextProvider } from "../../contexts/ThemeContext";
import AuthContextProvider from "../AuthContext";
import AlertContextProvider from "../AlertContext";
import AlertDialog from "../components/ui/AlertDialog";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as "en" | "ko")) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeContextProvider>
        <ThemeProvider>
          <AuthContextProvider>
            <AlertContextProvider>
              {children}
              <AlertDialog />
            </AlertContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </ThemeContextProvider>
    </NextIntlClientProvider>
  );
}
