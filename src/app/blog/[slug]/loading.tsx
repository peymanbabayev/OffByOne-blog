import BrandLoading from "@/components/ui/BrandLoading";

/**
 * Məqalə səhifəsinə keçid loading vəziyyəti:
 * Qırıq-qırıq boz xətlər əvəzinə vahid brend loqo animasiyasını göstərir.
 */
export default function BlogPostLoading() {
  return <BrandLoading message="Məqalə oxunmaq üçün gətirilir..." />;
}
