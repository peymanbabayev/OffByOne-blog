import { useEffect, useState } from "react";

/**
 * Ümumi (Generic) useDebounce hook-u.
 * 
 * Verilən dəyəri (value) yalnız göstərilən gecikmə müddəti (delayMs) keçdikdən sonra qaytarır.
 * Əgər istifadəçi gecikmə bitməmiş yeni dəyər daxil edərsə, əvvəlki taymer sıfırlanır.
 * 
 * @param value İzlənən dəyər (məsələn, input mətni)
 * @param delayMs Gözləmə müddəti (millisekund, default: 350ms)
 * @returns Gecikdirilmiş dəyər
 */
export function useDebounce<T>(value: T, delayMs: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
