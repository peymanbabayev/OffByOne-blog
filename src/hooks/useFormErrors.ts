import { useState } from "react";

/**
 * Server Action nəticəsindən gələn xətaları idarə edən və istifadəçi xanaya
 * yazdıqca həmin xətanı dinamik təmizləyən Custom Hook.
 *
 * `AuthActionState` və `CreatePostState` kimi bütün `{ error?, fieldErrors? }`
 * formalı state-lər üçün istifadə oluna bilər.
 *
 * Xətalar render zamanı birbaşa `state`-dən törədilir (sinxronizasiya effekti yoxdur):
 * yeni `state` gəldikdə əvvəlki "təmizlənmiş" sahələr avtomatik sıfırlanır, ona görə
 * uğurlu (təmiz) nəticədə köhnə mesajlar da itir.
 */
export interface FormErrorState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const GENERAL_KEY = "__general__";

export function useFormErrors(state: FormErrorState | null) {
  const [cleared, setCleared] = useState<{
    ref: FormErrorState | null;
    fields: Set<string>;
  }>({ ref: state, fields: new Set() });

  // "state dəyişəndə lokal state-i tənzimləmək" — React-in tövsiyə etdiyi
  // render-fazası pattern-i (effect əvəzinə).
  let clearedFields = cleared.fields;
  if (cleared.ref !== state) {
    clearedFields = new Set();
    setCleared({ ref: state, fields: clearedFields });
  }

  const generalError = clearedFields.has(GENERAL_KEY) ? undefined : state?.error;

  const getFieldError = (field: string) =>
    clearedFields.has(field) ? undefined : state?.fieldErrors?.[field]?.[0];

  const clearFieldError = (field: string) => {
    setCleared((prev) => {
      const fields = new Set(prev.fields);
      fields.add(field);
      fields.add(GENERAL_KEY);
      return { ref: state, fields };
    });
  };

  return { generalError, getFieldError, clearFieldError };
}
