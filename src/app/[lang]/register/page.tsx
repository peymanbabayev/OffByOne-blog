import type { Metadata } from "next";
import AuthContainer from "@/components/auth/AuthContainer";
import { sanitizeRedirectPath } from "@/lib/redirects";
import { getDictionaryFor } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(isLocale(lang) ? lang : defaultLocale);
  return {
    title: dict.meta.registerTitle,
    description: dict.meta.registerDescription,
  };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeFrom = sanitizeRedirectPath(from);

  return <AuthContainer initialMode="register" from={safeFrom} />;
}
