"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  isThemePreference,
  type ThemePreference,
  type ResolvedTheme,
} from "./config";

/** Eyni tabda `setPreference` çağırıldıqda dərhal xəbər vermək üçün (storage hadisəsi YALNIZ digər tablarda atılır). */
const CHANGE_EVENT = "theme:preference-change";

function readStoredPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(value) ? value : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "light" || pref === "dark") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
}

/**
 * `useSyncExternalStore`-un snapshot-u YALNIZ `preference`-i deyil, HƏLL EDİLMİŞ
 * (`resolved`) dəyəri də kodlaşdırır. Səbəb: "system" seçilibkən OS-un
 * `prefers-color-scheme`-i dəyişəndə yalnız `matchMedia` "change" hadisəsi
 * atılır — `localStorage` DƏYİŞMİR. Snapshot təkcə `preference`-dən ibarət
 * olsaydı, React iki hadisə arasında eyni "system" sətrini görüb heç bir
 * yenidən render etməzdi (dəyər dəyişmədiyi üçün) və DOM köhnə mövzuda qalardı.
 */
function getSnapshot(): string {
  const pref = readStoredPreference();
  return `${pref}:${resolveTheme(pref)}`;
}

/** SSR zamanı server heç vaxt `localStorage`/`matchMedia`-nı görmür — deterministik defolt. */
function getServerSnapshot(): string {
  return "system:light";
}

/**
 * `useStoredView` (bax: hooks/useStoredView.ts) ilə eyni abunəlik: `storage`
 * hadisəsi DİGƏR tabların `localStorage`-i dəyişməsini bildirir, `CHANGE_EVENT`
 * isə EYNI tabda `setPreference` çağırıldıqda. "system" seçilibsə OS-un canlı
 * dəyişikliyi də `matchMedia` "change" hadisəsi ilə izlənilir.
 */
function subscribe(onChange: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  mql.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    mql.removeEventListener("change", onChange);
  };
}

/**
 * Görünüş rejimini oxuyan/dəyişən client hook.
 *
 * `useSyncExternalStore` seçilib (`useStoredView` ilə eyni pattern) ki:
 * - server/client fərqi (SSR-də "system", brauzerdə həqiqi seçim) heç bir
 *   hydration xəbərdarlığı yaratmadan həll olunsun (React bunun üçün
 *   `getServerSnapshot`-u xüsusi idarə edir — bax: React sənədləri);
 * - dəyişiklik DİGƏR açıq tablara `storage` hadisəsi ilə PULSUZ ötürülsün;
 * - `useLayoutEffect`-ə ehtiyac qalmasın (ilk paint-dəki flaş artıq
 *   `<head>`-dəki inline skriptlə həll olunub — bax: theme/script.ts; bu hook
 *   DOM-u yalnız SONRAKI dəyişikliklərdə sinxronlaşdırır, adi `useEffect` kifayətdir).
 */
export function useTheme() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [preference, resolved] = snapshot.split(":") as [ThemePreference, ResolvedTheme];

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // localStorage əlçatmaz (məs. gizli rejim) — DOM-u yenə də tətbiq edirik
    }
    applyTheme(resolveTheme(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { preference, resolved, setPreference };
}
