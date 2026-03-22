import { z } from "zod";

export const SignInSchema = z.object({
  adminName: z.string().trim().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type SignInInput = z.infer<typeof SignInSchema>;
