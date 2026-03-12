import { z } from "zod";

export const CreateAdminSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Endereço de email inválido."),
  role: z.enum(["ADMIN", "SUPER_ADMIN"], {
    errorMap: () => ({ message: "Nível de permissão inválido." }),
  }),
});

export type CreateAdminInput = z.infer<typeof CreateAdminSchema>;

export type AdminEntity = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  createdAt: Date;
  updatedAt: Date;
};
