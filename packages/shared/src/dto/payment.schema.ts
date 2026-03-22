import { z } from "zod";

export const PaymentMethodSchema = z.enum([
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",
]);

export const PaymentStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FIRST_INSTALLMENT_PAID",
  "CANCELED",
  "ISENTO",
]);

export const PaymentSchema = z.object({
  value: z.number().nonnegative().default(0),
  method: PaymentMethodSchema.default("CASH"),
  status: PaymentStatusSchema.default("PENDING"),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
