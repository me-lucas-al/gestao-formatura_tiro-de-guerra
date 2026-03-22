import { z } from "zod";
import { PaymentEntitySchema } from "./payment.schema";

export const PaymentErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const PaymentMutationSuccessSchema = z.object({
  success: z.literal(true),
  data: PaymentEntitySchema,
});

export type PaymentErrorResult = z.infer<typeof PaymentErrorSchema>;
export type PaymentMutationSuccessResult = z.infer<
  typeof PaymentMutationSuccessSchema
>;

export type PaymentMutationResult =
  | PaymentMutationSuccessResult
  | PaymentErrorResult;
