import type { Metadata } from "next";
import AuthContainer from "@/components/auth/AuthContainer";
import { sanitizeRedirectPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Daxil ol | OffByOne",
  description: "OffByOne mühəndislik platformasında hesabınıza daxil olun.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeFrom = sanitizeRedirectPath(from);

  return <AuthContainer initialMode="login" from={safeFrom} />;
}
