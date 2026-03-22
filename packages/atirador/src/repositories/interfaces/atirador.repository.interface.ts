import type {
  AtiradorEntity,
  AtiradorFilters,
  CreateAtiradorInput,
  UpdateAtiradorInput,
} from "../../dto/atirador.schema";

export interface IAtiradorRepository {
  findMany(filters: AtiradorFilters): Promise<AtiradorEntity[]>;
  findByNumber(number: number, year: number): Promise<AtiradorEntity | null>;
  create(input: CreateAtiradorInput): Promise<AtiradorEntity>;
  update(input: UpdateAtiradorInput): Promise<AtiradorEntity>;
  findByIdWithRelations(id: number): Promise<AtiradorEntity | null>;
  deleteFamilyMemberPaymentById(paymentId: number): Promise<void>;
  deleteFamilyMemberById(familyMemberId: number): Promise<void>;
  deletePaymentById(paymentId: number): Promise<void>;
  deleteAtiradorById(id: number): Promise<void>;
  sumPaidAtiradorPaymentsByYear(year: number): Promise<number>;
  sumPaidFamilyMemberPaymentsByYear(year: number): Promise<number>;
}
