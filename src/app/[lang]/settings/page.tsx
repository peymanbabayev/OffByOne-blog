import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { formatLocaleDate } from "@/i18n/format";
import { getDictionary, getDictionaryFor, getLang } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";
import AvatarSettings from "@/components/settings/AvatarSettings";
import SignOutOtherDevicesButton from "@/components/settings/SignOutOtherDevicesButton";
import ThemeSettings from "@/components/settings/ThemeSettings";
import LanguageSettings from "@/components/settings/LanguageSettings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionaryFor(isLocale(lang) ? lang : defaultLocale);
  return {
    title: dict.meta.settingsTitle,
    description: dict.meta.settingsDescription,
  };
}

export default async function SettingsPage() {
  const [user, dict, lang] = await Promise.all([
    requireUser("/login?from=/settings"),
    getDictionary(),
    getLang(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Başlıq */}
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <span>{dict.settings.sectionLabel}</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
          {dict.settings.title}
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {dict.settings.subtitle}
        </p>
      </div>

      {/* Hesab məlumatı */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{dict.settings.nameLabel}</span>
          <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100">
            {user.name}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{dict.settings.statusLabel}</span>
          <span className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {user.role === "ADMIN" ? dict.myPosts.admin : dict.myPosts.author}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{dict.settings.emailLabel}</span>
          <span className="mt-1 block truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
            {user.email}
          </span>
        </div>
      </div>

      {/* Profil */}
      <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-50">{dict.settings.profileTitle}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {dict.settings.profileSubtitle}
        </p>
        <AvatarSettings initialUrl={user.avatar ?? undefined} />
      </section>

      {/* Görünüş */}
      <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-50">{dict.settings.appearanceTitle}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {dict.settings.appearanceSubtitle}
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <ThemeSettings />
        </div>
      </section>

      {/* Dil */}
      <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-50">{dict.settings.languageTitle}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {dict.settings.languageSubtitle}
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <LanguageSettings />
        </div>
      </section>

      {/* Təhlükəsizlik */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-50">{dict.settings.securityTitle}</h2>

        <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {dict.settings.signOutOthersTitle}
            </p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              {dict.settings.signOutOthersDesc}
            </p>
          </div>

          <div className="shrink-0">
            <SignOutOtherDevicesButton />
          </div>
        </div>

        <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          {dict.settings.memberSince} {formatLocaleDate(user.createdAt, lang)}
        </p>
      </section>
    </main>
  );
}
