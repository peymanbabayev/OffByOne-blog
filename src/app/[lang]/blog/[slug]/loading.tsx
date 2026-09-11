import BrandLoading from "@/components/ui/BrandLoading";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Məqalə səhifəsinə keçid loading vəziyyəti:
 * Qırıq-qırıq boz xətlər əvəzinə vahid brend loqo animasiyasını göstərir.
 */
export default async function BlogPostLoading() {
  const dict = await getDictionary();
  return <BrandLoading message={dict.loading.blogPost} />;
}
