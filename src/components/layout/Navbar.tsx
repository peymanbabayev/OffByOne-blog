import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction, logoutEverywhereAction } from "@/actions/auth";

/**
 * Server Component:
 * Bütün səhifələrdə birbaşa görünən naviqasiya zolağı.
 * Server tərəfdə sessiyanı (JWT) və istifadəçini yoxlayaraq dinamik UI göstərir.
 */
export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Loqo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            P
          </span>
          <span className="tracking-tight">
            Peyman<span className="text-blue-600">.dev</span>
          </span>
        </Link>

        {/* Sağ Hissə: Linklər və İstifadəçi Vəziyyəti */}
        <div className="flex items-center gap-3 sm:gap-6 text-sm">
          <nav className="hidden md:flex items-center gap-5 text-slate-600 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors py-1">
              Yazılar
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors py-1">
              Haqqımda
            </Link>
          </nav>

          {user ? (
            /* İstifadəçi daxil olub */
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/new-post"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <span>+</span>
                <span>Yeni Məqalə</span>
              </Link>

              {/* İstifadəçi Məlumatı & Rol Nişanı */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    {user.role === "ADMIN" ? (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">
                        ADMIN
                      </span>
                    ) : (
                      <span className="text-slate-400">İstifadəçi</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Çıxış Formaları (Server Action) */}
              <div className="flex items-center">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    title="Bu cihazdan çıxış"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Çıxış
                  </button>
                </form>
                <form action={logoutEverywhereAction}>
                  <button
                    type="submit"
                    title="Bütün cihazlardan çıxış (bütün sessiyaları ləğv et)"
                    className="px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Hər yerdən
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* İstifadəçi daxil olmayıb (Qonaq) */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all"
              >
                Daxil ol
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                Qeydiyyat
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
