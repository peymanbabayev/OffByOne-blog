import BrandLoading from "@/components/ui/BrandLoading";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Root Loading Vəziyyəti:
 * Səhifə açılan kimi qarışıq boz skeleton-lar əvəzinə
 * vahid, təmiz və estetik OffByOne loqo animasiyasını göstərir.
 */
export default async function RootLoading() {
  const dict = await getDictionary();
  return <BrandLoading message={dict.loading.root} />;
}
