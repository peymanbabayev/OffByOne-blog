import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { sanitizeRedirectPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Daxil ol | Mənim Bloqum",
  description: "Hesabınıza daxil olaraq məqalələrinizi idarə edin.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeFrom = sanitizeRedirectPath(from);

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-3 font-bold text-lg">
            🔑
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Xoş gəldiniz
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Davam etmək üçün hesabınıza daxil olun
          </p>
        </div>

        <LoginForm from={safeFrom} />
      </div>
    </div>
  );
}
