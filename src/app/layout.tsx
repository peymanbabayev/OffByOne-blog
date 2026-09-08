import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OffByOne — Mühəndislik və Sistem Qeydləri",
    template: "%s | OffByOne",
  },
  description:
    "Kompüter elmləri, paylanmış sistemlər, Next.js, verilənlər bazası və arxitektura haqqında dərin mühəndislik yazıları.",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "OffByOne",
    title: "OffByOne — Mühəndislik və Sistem Qeydləri",
    description:
      "Kompüter elmləri, paylanmış sistemlər, Next.js, verilənlər bazası və arxitektura haqqında dərin mühəndislik yazıları.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OffByOne — Mühəndislik və Sistem Qeydləri",
    description:
      "Kompüter elmləri, paylanmış sistemlər, Next.js, verilənlər bazası və arxitektura haqqında dərin mühəndislik yazıları.",
  },
};

/**
 * RootLayout bir Server Component-dir.
 * Bütün səhifələrdə ortaq olan Navbar və təməl struktur burada yer alır.
 * Gələcəkdə footer və ya digər qlobal elementləri də bura əlavə edəcəyik.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
