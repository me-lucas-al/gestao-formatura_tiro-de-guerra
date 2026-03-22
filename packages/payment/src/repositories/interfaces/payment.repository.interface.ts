import type {
  CreatePaymentInput,
  PaymentEntity,
  UpdatePaymentInput,
} from "../../dto/payment.schema";

export interface IPaymentRepository {
  findAtiradorById(id: number): Promise<{ id: number } | null>;
  findFamilyMemberById(id: number): Promise<{ id: number } | null>;
  findPaymentById(id: number): Promise<PaymentEntity | null>;
  create(input: CreatePaymentInput): Promise<PaymentEntity>;
  update(input: UpdatePaymentInput): Promise<PaymentEntity>;
}
