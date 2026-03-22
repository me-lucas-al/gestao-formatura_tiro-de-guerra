import {
  PaymentMethodSchema,
  PaymentStatusSchema,
} from "../../../shared/src/dto/payment.schema";
import { z } from "zod";

export const PaymentEntitySchema = z.object({
  id: z.number().int().positive(),
  value: z.number().nonnegative(),
  status: PaymentStatusSchema,
  method: PaymentMethodSchema,
  atiradorId: z.number().int().positive().nullable().optional(),
  familyMemberId: z.number().int().positive().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePaymentSchema = z.object({
  status: PaymentStatusSchema.optional(),
  value: z.coerce
    .number()
    .positive("O valor do pagamento deve ser positivo.")
    .optional(),
  method: PaymentMethodSchema.optional(),
  atiradorId: z.coerce.number().int().positive().optional(),
  familyMemberId: z.coerce.number().int().positive().optional(),
});

export const UpdatePaymentSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: PaymentStatusSchema.optional(),
  value: z.coerce
    .number()
    .positive("O valor do pagamento deve ser positivo.")
    .optional(),
  method: PaymentMethodSchema.optional(),
  atiradorId: z.coerce.number().int().positive().nullable().optional(),
  familyMemberId: z.coerce.number().int().positive().nullable().optional(),
});

export type PaymentEntity = z.infer<typeof PaymentEntitySchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
