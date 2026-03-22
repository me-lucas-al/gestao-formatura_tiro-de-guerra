import {
  PaymentErrorSchema,
  type PaymentMutationResult,
} from "../dto/payment-result.schema";
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from "../dto/payment.schema";
import type { IPaymentRepository } from "../repositories/interfaces/payment.repository.interface";

export class PaymentService {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async create(input: CreatePaymentInput): Promise<PaymentMutationResult> {
    if (!input.atiradorId && !input.familyMemberId) {
      return PaymentErrorSchema.parse({
        success: false,
        error: "O pagamento deve ser associado a um atirador ou a um familiar.",
      });
    }

    if (input.atiradorId && input.familyMemberId) {
      return PaymentErrorSchema.parse({
        success: false,
        error:
          "O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.",
      });
    }

    if (input.atiradorId) {
      const atirador = await this.paymentRepository.findAtiradorById(
        input.atiradorId,
      );

      if (!atirador) {
        return PaymentErrorSchema.parse({
          success: false,
          error: `Atirador com ID ${input.atiradorId} não encontrado.`,
        });
      }
    }

    if (input.familyMemberId) {
      const familyMember = await this.paymentRepository.findFamilyMemberById(
        input.familyMemberId,
      );

      if (!familyMember) {
        return PaymentErrorSchema.parse({
          success: false,
          error: `Familiar com ID ${input.familyMemberId} não encontrado.`,
        });
      }
    }

    const payment = await this.paymentRepository.create(input);

    return { success: true, data: payment };
  }

  async update(input: UpdatePaymentInput): Promise<PaymentMutationResult> {
    const existingPayment = await this.paymentRepository.findPaymentById(input.id);

    if (!existingPayment) {
      return PaymentErrorSchema.parse({
        success: false,
        error: `Pagamento com ID ${input.id} não encontrado.`,
      });
    }

    if (
      input.atiradorId !== undefined &&
      input.familyMemberId !== undefined &&
      input.atiradorId &&
      input.familyMemberId
    ) {
      return PaymentErrorSchema.parse({
        success: false,
        error:
          "O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.",
      });
    }

    if (input.atiradorId !== undefined && input.atiradorId !== null) {
      const atirador = await this.paymentRepository.findAtiradorById(input.atiradorId);

      if (!atirador) {
        return PaymentErrorSchema.parse({
          success: false,
          error: `Atirador com ID ${input.atiradorId} não encontrado.`,
        });
      }
    }

    if (input.familyMemberId !== undefined && input.familyMemberId !== null) {
      const familyMember = await this.paymentRepository.findFamilyMemberById(
        input.familyMemberId,
      );

      if (!familyMember) {
        return PaymentErrorSchema.parse({
          success: false,
          error: `Familiar com ID ${input.familyMemberId} não encontrado.`,
        });
      }
    }

    const payment = await this.paymentRepository.update(input);

    return { success: true, data: payment };
  }
}
