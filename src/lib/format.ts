const AZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

/**
 * Deterministik Azərbaycan tarixi — "8 sentyabr 2026".
 *
 * `Date.prototype.toLocaleDateString("az-AZ", …)` Node (server) və brauzer (client) ICU
 * məlumatı fərqli olduğu üçün fərqli nəticə verir və React hydration mismatch atır.
 * UTC komponentləri ilə əl formatlanması bunu tamamilə həll edir.
 */
export function formatAzDate(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return `${d.getUTCDate()} ${AZ_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
