import { useCallback, useSyncExternalStore } from "react";

export type PostView = "grid" | "index";

const KEY = "blog:view";
const EVENT = "blog:view-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function readView(): PostView {
  try {
    return localStorage.getItem(KEY) === "index" ? "index" : "grid";
  } catch {
    return "grid";
  }
}

/**
 * Yazı siyahısının görünüş rejimini (grid / index) `localStorage`-də saxlayır.
 *
 * `useSyncExternalStore` seçilib: SSR təhlükəsizdir (server snapshot həmişə "grid"),
 * hydration mismatch xətası vermir və effekt daxilində `setState` çağırmır
 * (`react-hooks/set-state-in-effect` qaydasını pozmur).
 */
export function useStoredView(): [PostView, (next: PostView) => void] {
  const view = useSyncExternalStore(subscribe, readView, () => "grid" as const);

  const setView = useCallback((next: PostView) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // localStorage əlçatmaz (private rejim və s.) — sükutla keçirik
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [view, setView];
}
