import BrandLoading from "@/components/ui/BrandLoading";

/**
 * About Səhifəsi üçün Suspense Loading Vəziyyəti:
 * İstifadəçi Navbar-dan və ya linklərdən "Haqqımızda" səhifəsinə keçid etdikdə
 * loqo animasiyası ilə dərhal vizual cavab verir.
 */
export default function AboutLoading() {
  return <BrandLoading message="Platforma haqqında məlumatlar hazırlanır..." />;
}
