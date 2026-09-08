import BrandLoading from "@/components/ui/BrandLoading";

/**
 * Root Loading Vəziyyəti:
 * Səhifə açılan kimi qarışıq boz skeleton-lar əvəzinə
 * vahid, təmiz və estetik OffByOne loqo animasiyasını göstərir.
 */
export default function RootLoading() {
  return <BrandLoading message="Mühəndislik qeydləri hazırlanır..." />;
}
