import { z } from "zod";
import type { Dictionary } from "@/i18n/types";

/**
 * Parol siyasəti: ən azı 8 simvol + ən azı bir hərf + ən azı bir rəqəm.
 * Həm qeydiyyat forması, həm də seed skripti bu sxemi paylaşır.
 *
 * Server Action-lar `next/root-params`-dan istifadə edə bilmədiyi üçün
 * (bax: i18n/action-locale.ts) mesajlar bir `Dictionary` qəbul edən factory
 * funksiyalar vasitəsilə lokallaşdırılır — çağıran tərəf öz dilini ötürür.
 */
export function getPasswordSchema(dict: Dictionary) {
  return z
    .string({ message: dict.validation.passwordRequired })
    .min(8, dict.validation.passwordMin)
    .max(100, dict.validation.passwordMax)
    .regex(/[A-Za-z]/, dict.validation.passwordLetter)
    .regex(/[0-9]/, dict.validation.passwordDigit);
}

/**
 * Qeydiyyat forması üçün Zod validasiya sxemi
 */
export function getRegisterSchema(dict: Dictionary) {
  return z
    .object({
      name: z
        .string({ message: dict.validation.nameRequired })
        .trim()
        .min(2, dict.validation.nameMin)
        .max(50, dict.validation.nameMax),
      email: z
        .string({ message: dict.validation.emailRequired })
        .trim()
        .toLowerCase()
        .email(dict.validation.emailInvalid),
      password: getPasswordSchema(dict),
      confirmPassword: z
        .string({ message: dict.validation.confirmPasswordRequired })
        .min(1, dict.validation.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.validation.passwordsMismatch,
      path: ["confirmPassword"], // Xətanı birbaşa 'confirmPassword' sahəsinə bağlayırıq
    });
}

export type RegisterInput = z.infer<ReturnType<typeof getRegisterSchema>>;

/**
 * Giriş forması üçün Zod validasiya sxemi
 */
export function getLoginSchema(dict: Dictionary) {
  return z.object({
    email: z
      .string({ message: dict.validation.emailRequired })
      .trim()
      .toLowerCase()
      .email(dict.validation.emailInvalid),
    password: z
      .string({ message: dict.validation.passwordRequired })
      .min(1, dict.validation.loginPasswordRequired),
  });
}

export type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>;
