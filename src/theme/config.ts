/**
 * Görünüş rejimi (theme) konfiqurasiyası.
 *
 * "system" seçildikdə OS-un `prefers-color-scheme`-i izlənilir; "light"/"dark"
 * isə istifadəçinin AÇIQ seçimidir. Seçim (`ThemePreference`) `localStorage`-də
 * saxlanılır — server heç vaxt oxumur (yalnız client-only UI seçimidir, eyni
 * `useStoredView` (bax: hooks/useStoredView.ts) pattern-i), ona görə:
 *  - `useSyncExternalStore` server/client fərqini xəbərdarlıqsız idarə edir,
 *  - `storage` hadisəsi vasitəsilə tablar arası sinxronizasiya PULSUZ gəlir.
 * DOM-a tətbiq olunan HƏLL EDİLMİŞ dəyər (`light` | `dark`) inline skript
 * tərəfindən paint-dən əvvəl hesablanır (bax: script.ts).
 */
export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_PREFERENCES: readonly ThemePreference[] = ["light", "dark", "system"];

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}
