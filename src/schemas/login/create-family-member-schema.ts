import { PaymentMethod } from '@prisma/client';
import { z } from 'zod';

export const createFamilyMemberSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  atiradorId: z.coerce.number().positive('O ID do atirador é obrigatório.'),
  paymentValue: z.coerce.number().positive('O valor do pagamento deve ser positivo.'),
  paymentMethod: z.enum(PaymentMethod),
});

export type CreateFamilyMemberData = z.infer<typeof createFamilyMemberSchema>;