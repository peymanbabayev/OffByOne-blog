"use client";

import { getThemeInitScript } from "./script";

/**
 * `getThemeInitScript()`-i Client Component olaraq render edir.
 *
 * Səbəb: kök layout (`app/[lang]/layout.tsx`) Server Component-dir və
 * `<html lang={lang}>` `[lang]` route parametrindən asılıdır. Dil
 * dəyişdirildikdə (məs. `/az/...` -> `/en/...`) kök layout SERVERDƏ YENİDƏN
 * icra olunur və nəticə brauzerin React reconciler-inə göndərilir — bu,
 * `<script>`-i "client-də render olunan element" kimi qarşılayır və React
 * dev-də "Scripts inside React components are never executed when rendering
 * on the client" xəbərdarlığı verir (adi səhifə keçidində bu baş vermir,
 * çünki `[lang]` dəyişmədikcə kök layout təkrar render olunmur).
 *
 * Həll (bax: Next.js "Preventing Flash Before Hydration" bələdçisi —
 * "Extracting a reusable component"): skripti Client Component edirik.
 * - Naviqasiyalar arası Client Component-lər (mövqeyi/props-u dəyişməyibsə)
 *   YENİDƏN RENDER OLUNMADAN qalır — ona görə bu skript dil keçidində
 *   ümumiyyətlə toxunulmayacaq.
 * - Ehtiyat üçün server/client `type` fərqi + `suppressHydrationWarning`:
 *   serverdə (ilk HTML-də) "text/javascript" kimi normal icra olunur;
 *   client tərəfdə (hər hansı təkrar render zamanı) "text/plain" — brauzer
 *   onu skript kimi YOX, inert məzmun kimi görür, React da xəbərdarlıq vermir.
 */
export default function InlineThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: getThemeInitScript() }}
    />
  );
}
