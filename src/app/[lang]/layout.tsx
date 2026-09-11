import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n/client";
import { getDictionaryFor } from "@/i18n/dictionaries";
import { locales, isLocale, defaultLocale, type Locale } from "@/i18n/config";
import InlineThemeScript from "@/theme/InlineThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const OG_LOCALES: Record<Locale, string> = {
  az: "az_AZ",
  en: "en_US",
  ru: "ru_RU",
};

/** Hər dəstəklənən dil üçün statik build zamanı prerender olunur. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionaryFor(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.defaultTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.defaultDescription,
    icons: {
      icon: [
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
    },
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        // Dəstəklənməyən dillərdən gələn istifadəçi/botlar üçün defolt versiya
        // (bax: Google Search Central hreflang bələdçisi).
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALES[lang],
      siteName: dict.meta.siteName,
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
    },
  };
}

/**
 * RootLayout bir Server Component-dir və `app/[lang]/layout.tsx` olaraq
 * kökdür (bax: Next.js "Internationalization" bələdçisi — `[lang]` bütün
 * `app/`-ın həqiqi kökü kimi işləyir, ayrıca `app/layout.tsx` lazım deyil).
 *
 * Görünüş rejimi: `<head>`-dəki inline skript `data-theme`-i ilk paint-dən
 * əvvəl DOM-a yazır (bax: theme/script.ts) — buna görə `<html>` üzərində
 * `suppressHydrationWarning` var.
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang;
  const dict = getDictionaryFor(lang);

  return (
    <html
      lang={lang}
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <InlineThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <I18nProvider lang={lang} dict={dict}>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
