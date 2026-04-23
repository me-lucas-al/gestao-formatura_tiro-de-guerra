import { z } from "zod";

export const AdminRoleSchema = z.enum(["ADMIN", "SUPER_ADMIN"]);

export const AdminEntitySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(3),

  role: AdminRoleSchema,
  year: z.number().int().min(2020).max(2100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAdminSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres."),
  role: AdminRoleSchema,
  year: z.coerce
    .number()
    .int("O ano deve ser um número inteiro.")
    .min(2020, "Ano inválido.")
    .max(2100, "Ano inválido."),
});

export const AdminActorSchema = z.object({
  id: z.number().int().positive(),
  role: AdminRoleSchema,
  year: z.number().int().min(2020).max(2100),
});

export const CreateAdminWithPasswordSchema = CreateAdminSchema.extend({
  passwordHash: z.string().min(1),
});

export const ChangePasswordSchema = z
  .object({
    adminId: z.number().int().positive(),
    newPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((payload) => payload.newPassword === payload.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const DeleteAdminSchema = z.object({
  adminId: z.number().int().positive(),
});

export type AdminEntity = z.infer<typeof AdminEntitySchema>;
export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;
export type AdminActor = z.infer<typeof AdminActorSchema>;
export type CreateAdminWithPasswordInput = z.infer<
  typeof CreateAdminWithPasswordSchema
>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type DeleteAdminInput = z.infer<typeof DeleteAdminSchema>;
