import { z } from "zod";

/**
 * Parol siyasəti: ən azı 8 simvol + ən azı bir hərf + ən azı bir rəqəm.
 * Həm qeydiyyat forması, həm də seed skripti bu sxemi paylaşır.
 */
export const passwordSchema = z
  .string({ message: "Şifrə daxil edilməlidir." })
  .min(8, "Şifrə ən azı 8 simvoldan ibarət olmalıdır.")
  .max(100, "Şifrə 100 simvoldan artıq ola bilməz.")
  .regex(/[A-Za-z]/, "Şifrədə ən azı bir hərf olmalıdır.")
  .regex(/[0-9]/, "Şifrədə ən azı bir rəqəm olmalıdır.");

/**
 * Qeydiyyat forması üçün Zod validasiya sxemi
 */
export const registerSchema = z
  .object({
    name: z
      .string({ message: "Ad daxil edilməlidir." })
      .trim()
      .min(2, "Ad ən azı 2 simvoldan ibarət olmalıdır.")
      .max(50, "Ad 50 simvoldan artıq ola bilməz."),
    email: z
      .string({ message: "E-poçt daxil edilməlidir." })
      .trim()
      .toLowerCase()
      .email("Düzgün e-poçt ünvanı daxil edin."),
    password: passwordSchema,
    confirmPassword: z
      .string({ message: "Şifrə təkrarı daxil edilməlidir." })
      .min(1, "Şifrə təkrarı daxil edilməlidir."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifrələr bir-biri ilə uyğun gəlmir.",
    path: ["confirmPassword"], // Xətanı birbaşa 'confirmPassword' sahəsinə bağlayırıq
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Giriş forması üçün Zod validasiya sxemi
 */
export const loginSchema = z.object({
  email: z
    .string({ message: "E-poçt daxil edilməlidir." })
    .trim()
    .toLowerCase()
    .email("Düzgün e-poçt ünvanı daxil edin."),
  password: z
    .string({ message: "Şifrə daxil edilməlidir." })
    .min(1, "Şifrə daxil edilməlidir."),
});

export type LoginInput = z.infer<typeof loginSchema>;
