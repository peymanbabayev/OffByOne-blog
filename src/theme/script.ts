import { THEME_STORAGE_KEY } from "./config";

/**
 * `<head>`-də sinxron icra olunan inline skript (bax: Next.js "Preventing
 * Flash Before Hydration" bələdçisi). `localStorage`-dəki seçimi ("light" |
 * "dark" | "system") oxuyur, "system"-i `prefers-color-scheme` ilə həll edir
 * və `<html data-theme>`-i brauzer ilk paint-i etməmişdən ƏVVƏL yazır —
 * görünüş flaş etmir. `localStorage` server tərəfindən görünmür, ona görə
 * kökdə heç nə statik prerender-i pozmur.
 */
export function getThemeInitScript(): string {
  return `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");var r=(p==="dark"||p==="light")?p:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",r);document.documentElement.style.colorScheme=r}catch(e){}})()`;
}
