import z from "zod";

export const updateFamilyMemberSchema = z.object({
  id: z.coerce.number().positive("ID inválido."),
  age: z.coerce.number().positive("A idade deve ser um número positivo.").max(100, "A idade deve ser menor que 100."),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres.").optional(),
  payment: {
    status: z.enum(PaymentStatus),
    value: z.coerce.number().positive("O valor do pagamento deve ser positivo."),
    method: z.enum(PaymentMethod),
  },
});

export type UpdateFamilyMemberData = z.infer<typeof updateFamilyMemberSchema>;