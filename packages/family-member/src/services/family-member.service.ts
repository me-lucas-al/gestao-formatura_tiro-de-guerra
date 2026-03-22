import {
  FamilyMemberErrorSchema,
  type DeleteFamilyMemberResult,
  type FamilyMemberMutationResult,
  type ListFamilyMemberResult,
} from "../dto/family-member-result.schema";
import type {
  CreateFamilyMemberInput,
  FamilyMemberFilters,
  UpdateFamilyMemberInput,
} from "../dto/family-member.schema";
import type {
  FamilyMemberRepositoryFilters,
  IFamilyMemberRepository,
} from "../repositories/interfaces/family-member.repository.interface";

export class FamilyMemberService {
  constructor(private readonly familyMemberRepository: IFamilyMemberRepository) {}

  async findMany(filters: FamilyMemberFilters): Promise<ListFamilyMemberResult> {
    const repositoryFilters: FamilyMemberRepositoryFilters = {
      year: filters.year,
      name: filters.name,
    };

    if (!filters.status || filters.status === "ALL") {
      const familyMembers = await this.familyMemberRepository.findMany(
        repositoryFilters,
      );

      return { success: true, data: familyMembers };
    }

    if (filters.status === "ISENTO") {
      const familyMembers = await this.familyMemberRepository.findMany({
        ...repositoryFilters,
        maximumAge: 5,
      });

      return { success: true, data: familyMembers };
    }

    if (filters.status === "PENDING") {
      const familyMembers = await this.familyMemberRepository.findMany({
        ...repositoryFilters,
        minimumAge: 6,
        paymentStatus: "PENDING",
        includeNullPayment: true,
      });

      return { success: true, data: familyMembers };
    }

    const familyMembers = await this.familyMemberRepository.findMany({
      ...repositoryFilters,
      paymentStatus: filters.status,
    });

    return { success: true, data: familyMembers };
  }

  async create(
    input: CreateFamilyMemberInput,
  ): Promise<FamilyMemberMutationResult> {
    const familyMember = await this.familyMemberRepository.create(input);

    return { success: true, data: familyMember };
  }

  async update(
    input: UpdateFamilyMemberInput,
  ): Promise<FamilyMemberMutationResult> {
    const familyMember = await this.familyMemberRepository.update(input);

    return { success: true, data: familyMember };
  }

  async deleteWithPayment(id: number): Promise<DeleteFamilyMemberResult> {
    const familyMember = await this.familyMemberRepository.findByIdWithPayment(id);

    if (!familyMember) {
      return FamilyMemberErrorSchema.parse({
        success: false,
        error: `Familiar com ID ${id} não encontrado.`,
      });
    }

    if (familyMember.payment?.id) {
      await this.familyMemberRepository.deletePaymentById(familyMember.payment.id);
    }

    await this.familyMemberRepository.deleteById(id);

    return { success: true };
  }
}
