import { z } from "zod";

export const signInSchema = z.object({
  adminName: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type SignInData = z.infer<typeof signInSchema>;