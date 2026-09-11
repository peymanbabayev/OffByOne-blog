"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE_NAME, LOCALE_COOKIE_MAX_AGE, type Locale } from "./config";
import { useLang } from "./client";

/** Cari yolun başındakı dil seqmentini çıxarır: "/az/blog/foo" -> "/blog/foo". */
function stripLocale(pathname: string, lang: Locale): string {
  if (pathname === `/${lang}`) return "/";
  if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  return pathname;
}

/**
 * Dil dəyişdirmə məntiqini mərkəzləşdirir (`LanguageSwitcher` + `LanguageSettings`
 * arasında paylaşılır — əvvəllər hər ikisində təkrarlanırdı).
 *
 * Qəsdən `useSearchParams()` İŞLƏTMİR: `LanguageSwitcher` `Navbar`-da, o da
 * kök `layout.tsx`-də (yəni HƏR səhifədə) render olunur. `useSearchParams()`
 * `<Suspense>` sərhədi olmadan bu cür qlobal yerdə istifadə olunsa, Next.js
 * bütün route ağacını statik optimizasiyadan çıxarır (bax: Next.js
 * "missing-suspense-with-csr-bailout"). Sorğu sətri yalnız KLİK ANINDA
 * `window.location.search`-dən oxunur — render zamanı ona abunə olunmur, ona
 * görə Suspense-ə ehtiyac qalmır.
 *
 * `router.push` `startTransition` içindədir (bax: `SearchAndFilter.tsx`-dəki
 * eyni pattern): `[lang]` kök layout-un öz parametri olduğu üçün dil dəyişəndə
 * Next.js bütün ağacı yenidən render edir (bax: layihə qeydləri) — transition
 * olmadan bu, `loading.tsx`-in tam-ekran fallback-ini dərhal göstərərdi.
 * Transiya ilə köhnə səhifə hazır olana qədər ekranda qalır, `isPending`
 * yalnız kiçik, yerli bir indikator üçün istifadə olunur.
 */
export function useLanguageSwitch() {
  const lang = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = useCallback(
    (next: Locale) => {
      if (next === lang) return;

      try {
        document.cookie = `${LOCALE_COOKIE_NAME}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
      } catch {
        // cookie yazıla bilmir — yenə naviqasiya davam edir, sadəcə seçim yadda qalmır
      }

      const rest = stripLocale(pathname, lang);
      // `location.search` "?"-lə birlikdə (və ya sorğu yoxdursa boş sətir) qayıdır.
      const qs = typeof window !== "undefined" ? window.location.search : "";
      const target = `/${next}${rest === "/" ? "" : rest}${qs}`;
      startTransition(() => {
        router.push(target || `/${next}`);
      });
    },
    [lang, pathname, router]
  );

  return { lang, switchTo, isPending };
}
