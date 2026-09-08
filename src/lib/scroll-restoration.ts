/**
 * Sonsuz sürüşdürmə (infinite scroll) siyahıları üçün mövqe bərpası köməkçiləri.
 *
 * Problem: istifadəçi siyahını aşağı sürüşdürüb bir məqaləyə keçir, sonra "geri"
 * düyməsi ilə qayıdır — Next.js App Router səhifə seqmentini yenidən render edir,
 * client state (əlavə yüklənmiş məqalələr) itir və səhifə ən başa qayıdır.
 *
 * Həll: siyahının vəziyyətini (yüklənmiş elementlər + səhifə + scroll mövqeyi)
 * `sessionStorage`-də saxlayırıq və YALNIZ brauzerin geri/irəli naviqasiyasında
 * geri yükləyirik. Adi keçidlərdə (naviqasiya menyusu, yeni axtarış) siyahı
 * normal şəkildə ən başdan başlayır.
 */

const PREFIX = "infinite-scroll:";
const TTL_MS = 30 * 60 * 1000; // 30 dəqiqə
const POPSTATE_FALLBACK_MS = 5000; // Navigation API olmadıqda ehtiyat pəncərə

export interface ScrollSnapshot<T> {
  items: T[];
  page: number;
  hasMore: boolean;
  scrollY: number;
  ts: number;
}

// --- Geri/irəli naviqasiyanın aşkarlanması -----------------------------------
//
// Next.js App Router `navigate:traverse` hadisəsində səhifəni keşdən yenidən
// render edir — bu, `popstate`-dən ƏVVƏL baş verir. Ona görə latch-i həm
// Navigation API-nin `"traverse"` tipi, həm də `popstate` ilə aktiv edirik.
// Yeni keçid (`"push"`) latch-i sıfırlayır; siyahı onu OXUYARKƏN "istehlak edir"
// (bir dəfəlik) — belə ki, sonrakı filtr dəyişməsi (`replace`) bərpa etməsin.

interface NavigateEventLike {
  navigationType?: "push" | "replace" | "reload" | "traverse";
}
interface NavigationLike {
  addEventListener: (type: "navigate", cb: (e: NavigateEventLike) => void) => void;
}

let hasNavigationApi = false;
let backForwardLatched = false;
let lastPopStateAt = 0;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    backForwardLatched = true;
    lastPopStateAt = Date.now();
  });

  const navigation = (window as unknown as { navigation?: NavigationLike }).navigation;
  if (navigation) {
    hasNavigationApi = true;
    navigation.addEventListener("navigate", (e) => {
      if (e.navigationType === "traverse") {
        backForwardLatched = true;
      } else if (e.navigationType === "push") {
        backForwardLatched = false;
      }
    });
  }
}

/**
 * Cari naviqasiya brauzerin geri/irəli düyməsi ilə baş veribmi?
 * Nəticəni qaytardıqdan sonra latch-i sıfırlayır (bir dəfəlik istehlak).
 */
export function isBackForwardNavigation(): boolean {
  const result = hasNavigationApi
    ? backForwardLatched
    : Date.now() - lastPopStateAt < POPSTATE_FALLBACK_MS;

  backForwardLatched = false;
  lastPopStateAt = 0;
  return result;
}

// --- Snapshot oxu/yaz -------------------------------------------------------

export function readScrollSnapshot<T>(key: string): ScrollSnapshot<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const snap = JSON.parse(raw) as ScrollSnapshot<T>;
    if (!snap || typeof snap.ts !== "number" || Date.now() - snap.ts > TTL_MS) {
      sessionStorage.removeItem(PREFIX + key);
      return null;
    }
    return snap;
  } catch {
    return null;
  }
}

export function writeScrollSnapshot<T>(
  key: string,
  snapshot: Omit<ScrollSnapshot<T>, "ts">
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      PREFIX + key,
      JSON.stringify({ ...snapshot, ts: Date.now() })
    );
  } catch {
    // sessionStorage dolu və ya əlçatmaz (private rejim və s.) — sükutla keçirik
  }
}

export function clearScrollSnapshot(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PREFIX + key);
  } catch {
    // yoxla
  }
}
