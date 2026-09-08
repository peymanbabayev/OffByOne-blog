/**
 * Azərbaycan hərflərini və xüsusi simvolları nəzərə alaraq
 * başlıqdan SEO və URL-dostu slug yaradan mərkəzi köməkçi funksiya.
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  const azMap: Record<string, string> = {
    ə: "e", Ə: "e", ı: "i", I: "i",
    İ: "i", i: "i", ö: "o", Ö: "o",
    ü: "u", Ü: "u", ğ: "g", Ğ: "g",
    ç: "c", Ç: "c", ş: "s", Ş: "s",
  };

  const converted = text
    .split("")
    .map((char) => azMap[char] || char)
    .join("");

  return converted
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
