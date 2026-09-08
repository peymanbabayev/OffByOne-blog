import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { formatAzDate } from "@/lib/format";
import AvatarSettings from "@/components/settings/AvatarSettings";
import SignOutOtherDevicesButton from "@/components/settings/SignOutOtherDevicesButton";

export const metadata: Metadata = {
  title: "Tənzimləmələr | OffByOne",
  description: "Hesab məlumatlarınızı və aktiv sessiyalarınızı idarə edin.",
};

export default async function SettingsPage() {
  const user = await requireUser("/login?from=/settings");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Başlıq */}
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <span>Hesab və təhlükəsizlik</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Tənzimləmələr
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Hesab məlumatlarınızı və aktiv sessiyalarınızı buradan idarə edin.
        </p>
      </div>

      {/* Hesab məlumatı */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="mb-1 block text-xs font-medium text-slate-500">Ad</span>
          <span className="block truncate text-sm font-bold text-slate-800">
            {user.name}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="mb-1 block text-xs font-medium text-slate-500">Status</span>
          <span className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {user.role === "ADMIN" ? "Sistem Administratoru" : "Müəllif"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="mb-1 block text-xs font-medium text-slate-500">E-poçt</span>
          <span className="mt-1 block truncate text-xs font-semibold text-slate-700">
            {user.email}
          </span>
        </div>
      </div>

      {/* Profil */}
      <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Profil</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Profil şəklinizi əlavə edin və ya dəyişin.
        </p>
        <AvatarSettings initialUrl={user.avatar ?? undefined} />
      </section>

      {/* Təhlükəsizlik */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">Təhlükəsizlik</h2>

        <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800">
              Bütün digər cihazlardan çıxış
            </p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Başqa brauzer və cihazlardakı bütün aktiv sessiyalar dərhal bağlanır.
              Bu cihazdakı sessiyanız açıq qalır. Şifrənizin başqasına məlum olduğundan
              şübhələnirsinizsə bu addımı atın.
            </p>
          </div>

          <div className="shrink-0">
            <SignOutOtherDevicesButton />
          </div>
        </div>

        <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
          Üzv olma tarixi: {formatAzDate(user.createdAt)}
        </p>
      </section>
    </main>
  );
}
