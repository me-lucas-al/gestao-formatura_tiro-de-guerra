import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createPaymentSchema = z.object({
  id: z.coerce.number().optional(),

  status: z
    .enum(Object.values(PaymentStatus) as [string, ...string[]])
    .optional(),
  value: z.coerce
    .number()
    .positive("O valor do pagamento deve ser positivo.")
    .optional(),
  method: z
    .enum(Object.values(PaymentMethod) as [string, ...string[]])
    .optional(),
  atiradorId: z.coerce.number().optional(),
  familyMemberId: z.coerce.number().optional(),
});

export type CreatePaymentData = z.infer<typeof createPaymentSchema>;
