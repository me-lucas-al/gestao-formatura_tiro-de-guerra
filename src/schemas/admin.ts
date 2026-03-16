import { z } from "zod";
import type { Admin } from "@prisma/client";

export const CreateAdminSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  role: z.enum(["ADMIN", "SUPER_ADMIN"], {
    error: "Nível de permissão inválido.",
  }),
  year: z.coerce
    .number()
    .int("O ano deve ser um número inteiro.")
    .min(2020, "Ano inválido.")
    .max(2100, "Ano inválido."),
});

export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;

export type AdminEntity = Omit<Admin, "password">;
