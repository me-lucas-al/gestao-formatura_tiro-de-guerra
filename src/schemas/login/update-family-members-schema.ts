import z from "zod";

export const updateFamilyMemberSchema = z.object({
  id: z.coerce.number().positive("ID inválido."),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres.").optional(),
  paymentValue: z.coerce.number().positive("O valor deve ser positivo.").optional(),
  paymentMethod: z.enum(PaymentMethod).optional(),
});

export type UpdateFamilyMemberData = z.infer<typeof updateFamilyMemberSchema>;