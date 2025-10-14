import { z } from 'zod';

export const createFamilyMemberSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  age: z.coerce.number().positive('A idade deve ser um número positivo.').max(100, 'A idade deve ser menor que 100.'),
  atiradorId: z.coerce.number().positive('O ID do atirador é obrigatório.'),
  payment: z.object({
    status: z.enum(Object.values(PaymentStatus) as [string, ...string[]]).optional(),
    value: z.coerce.number().positive('O valor do pagamento deve ser positivo.').optional(),
    method: z.enum(Object.values(PaymentMethod) as [string, ...string[]]).optional(),
  }).optional(),
});

export type CreateFamilyMemberData = z.infer<typeof createFamilyMemberSchema>;