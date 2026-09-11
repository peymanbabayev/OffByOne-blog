import BrandLoading from "@/components/ui/BrandLoading";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * About Səhifəsi üçün Suspense Loading Vəziyyəti:
 * İstifadəçi Navbar-dan və ya linklərdən "Haqqımızda" səhifəsinə keçid etdikdə
 * loqo animasiyası ilə dərhal vizual cavab verir.
 */
export default async function AboutLoading() {
  const dict = await getDictionary();
  return <BrandLoading message={dict.loading.about} />;
}
