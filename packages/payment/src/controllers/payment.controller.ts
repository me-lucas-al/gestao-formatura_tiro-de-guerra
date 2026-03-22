"use server";

import { PaymentErrorSchema } from "../dto/payment-result.schema";
import {
  CreatePaymentSchema,
  UpdatePaymentSchema,
} from "../dto/payment.schema";
import { paymentRepository } from "../repositories/actions/payment.repository.actions";
import { PaymentService } from "../services/payment.service";

const createPaymentService = () => new PaymentService(paymentRepository);

export const createPaymentController = async (input: unknown) => {
  const parsedInput = CreatePaymentSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return PaymentErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createPaymentService();

  return service.create(parsedInput.data);
};

export const updatePaymentController = async (input: unknown) => {
  const parsedInput = UpdatePaymentSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return PaymentErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createPaymentService();

  return service.update(parsedInput.data);
};
