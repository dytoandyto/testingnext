import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getPublicActiveTheme } from "@/services/public-queries";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "id")) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, activeTheme] = await Promise.all([
    getMessages(),
    getPublicActiveTheme(),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      {activeTheme && (
        <style id="sanctuary-active-theme">{`
          :root {
            --realm-bg: ${activeTheme.bgPrimary};
            --realm-bg-surface: ${activeTheme.bgSurface};
            --realm-bg-card: ${activeTheme.bgCard};
            --realm-border: ${activeTheme.border};
            --realm-amber: ${activeTheme.amber};
            --realm-moss: ${activeTheme.moss};
            --realm-clay: ${activeTheme.clay};
            --realm-parchment: ${activeTheme.parchment};
          }
        `}</style>
      )}
      <div className="flex min-h-screen flex-col bg-[var(--realm-bg)] text-[var(--realm-text-primary)]">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
