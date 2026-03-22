import type {
  CreateFamilyMemberInput,
  FamilyMemberEntity,
  UpdateFamilyMemberInput,
} from "../../dto/family-member.schema";

export type FamilyMemberRepositoryFilters = {
  year: number;
  name?: string;
  paymentStatus?: "PENDING" | "PAID" | "FIRST_INSTALLMENT_PAID" | "CANCELED";
  includeNullPayment?: boolean;
  minimumAge?: number;
  maximumAge?: number;
};

export interface IFamilyMemberRepository {
  findMany(filters: FamilyMemberRepositoryFilters): Promise<FamilyMemberEntity[]>;
  create(input: CreateFamilyMemberInput): Promise<FamilyMemberEntity>;
  update(input: UpdateFamilyMemberInput): Promise<FamilyMemberEntity>;
  findByIdWithPayment(id: number): Promise<FamilyMemberEntity | null>;
  deletePaymentById(paymentId: number): Promise<void>;
  deleteById(id: number): Promise<void>;
}
