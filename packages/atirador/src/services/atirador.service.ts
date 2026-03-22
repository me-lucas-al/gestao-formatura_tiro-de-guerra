import {
  AtiradorErrorSchema,
  type AtiradorMutationResult,
  type DeleteAtiradorResult,
  type GetTotalArrecadadoResult,
  type ListAtiradorResult,
} from "../dto/atirador-result.schema";
import type {
  AtiradorFilters,
  CreateAtiradorInput,
  UpdateAtiradorInput,
} from "../dto/atirador.schema";
import type { IAtiradorRepository } from "../repositories/interfaces/atirador.repository.interface";

export class AtiradorService {
  constructor(private readonly atiradorRepository: IAtiradorRepository) {}

  async findMany(filters: AtiradorFilters): Promise<ListAtiradorResult> {
    const atiradores = await this.atiradorRepository.findMany(filters);

    return { success: true, data: atiradores };
  }

  async create(input: CreateAtiradorInput): Promise<AtiradorMutationResult> {
    const existingAtirador = await this.atiradorRepository.findByNumber(
      input.number,
      input.year,
    );

    if (existingAtirador) {
      return AtiradorErrorSchema.parse({
        success: false,
        error: `Já existe um atirador com o número ${input.number}.`,
      });
    }

    const createdAtirador = await this.atiradorRepository.create(input);

    return { success: true, data: createdAtirador };
  }

  async update(input: UpdateAtiradorInput): Promise<AtiradorMutationResult> {
    const updatedAtirador = await this.atiradorRepository.update(input);

    return { success: true, data: updatedAtirador };
  }

  async deleteWithRelations(id: number): Promise<DeleteAtiradorResult> {
    const atirador = await this.atiradorRepository.findByIdWithRelations(id);

    if (!atirador) {
      return AtiradorErrorSchema.parse({
        success: false,
        error: `Atirador com ID ${id} não encontrado.`,
      });
    }

    for (const familyMember of atirador.familyMembers) {
      if (familyMember.payment?.id) {
        await this.atiradorRepository.deleteFamilyMemberPaymentById(
          familyMember.payment.id,
        );
      }

      await this.atiradorRepository.deleteFamilyMemberById(familyMember.id);
    }

    if (atirador.payment?.id) {
      await this.atiradorRepository.deletePaymentById(atirador.payment.id);
    }

    await this.atiradorRepository.deleteAtiradorById(id);

    return { success: true };
  }

  async getTotalArrecadado(year: number): Promise<GetTotalArrecadadoResult> {
    const atiradorTotal =
      await this.atiradorRepository.sumPaidAtiradorPaymentsByYear(year);
    const familyMemberTotal =
      await this.atiradorRepository.sumPaidFamilyMemberPaymentsByYear(year);

    return { success: true, data: atiradorTotal + familyMemberTotal };
  }
}
