import BrandLoading from "@/components/ui/BrandLoading";
import { getDictionary } from "@/i18n/dictionaries";

export default async function EditPostLoading() {
  const dict = await getDictionary();
  return <BrandLoading message={dict.loading.editPost} />;
}
