import { ThemeProvider } from "@/components/common/theme/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleType, routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    icons: { icon: "/favicon.svg" },
    locale,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as LocaleType)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
      <Toaster expand richColors />
    </>
  );
}
