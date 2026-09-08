import type { Metadata } from "next";
import AuthContainer from "@/components/auth/AuthContainer";
import { sanitizeRedirectPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Qeydiyyat | OffByOne",
  description: "OffByOne platformasında yeni hesab yaradaraq mühəndislik məqalələrinizi dərc edin.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeFrom = sanitizeRedirectPath(from);

  return <AuthContainer initialMode="register" from={safeFrom} />;
}
