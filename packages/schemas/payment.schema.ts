import { z } from "zod";

export const PaymentMethodEnum = z.enum([
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",
]);
export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "FIRST_INSTALLMENT_PAID",
  "CANCELED",
  "ISENTO",
]);

export const paymentSchema = z.object({
  status: PaymentStatusEnum,
  value: z.number().optional().default(0),
  method: PaymentMethodEnum.optional().default("CASH"),
});

export type PaymentData = z.infer<typeof paymentSchema>;
