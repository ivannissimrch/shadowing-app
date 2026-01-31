import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ThemeProvider from "../../themes/ThemeProvider";
import { ThemeContextProvider } from "../../contexts/ThemeContext";
import AuthContextProvider from "../AuthContext";
import AlertContextProvider from "../AlertContext";
import AlertDialog from "../components/ui/AlertDialog";
import SnackbarContextProvider from "../SnackbarContext";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ko")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeContextProvider>
        <ThemeProvider>
          <AuthContextProvider>
            <AlertContextProvider>
              <SnackbarContextProvider>
                {children}
                <AlertDialog />
              </SnackbarContextProvider>
            </AlertContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </ThemeContextProvider>
    </NextIntlClientProvider>
  );
}
