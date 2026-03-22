import { describe, expect, it, vi } from "vitest";
import type { IFamilyMemberRepository } from "../../src/repositories/interfaces/family-member.repository.interface";
import { FamilyMemberService } from "../../src/services/family-member.service";

const createRepositoryMock = (): IFamilyMemberRepository => ({
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findByIdWithPayment: vi.fn(),
  deletePaymentById: vi.fn(),
  deleteById: vi.fn(),
});

describe("FamilyMemberService", () => {
  it("aplica filtro ISENTO com idade maxima 5", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findMany).mockResolvedValue([]);

    const service = new FamilyMemberService(repository);

    const result = await service.findMany({
      year: 2026,
      status: "ISENTO",
    });

    expect(result).toEqual({ success: true, data: [] });
    expect(repository.findMany).toHaveBeenCalledWith({
      year: 2026,
      name: undefined,
      maximumAge: 5,
    });
  });

  it("aplica filtro PENDING com pagamento nulo incluido e idade minima 6", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findMany).mockResolvedValue([]);

    const service = new FamilyMemberService(repository);

    await service.findMany({
      year: 2026,
      status: "PENDING",
    });

    expect(repository.findMany).toHaveBeenCalledWith({
      year: 2026,
      name: undefined,
      minimumAge: 6,
      paymentStatus: "PENDING",
      includeNullPayment: true,
    });
  });

  it("cria familiar com sucesso", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.create).mockResolvedValue({
      id: 1,
      name: "Familiar",
      age: 18,
      atiradorId: 2,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      payment: null,
      atirador: {
        id: 2,
        name: "Atirador",
        number: 12,
        year: 2026,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const service = new FamilyMemberService(repository);
    const result = await service.create({
      name: "Familiar",
      age: 18,
      atiradorId: 2,
    });

    expect(result.success).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("retorna erro ao deletar familiar inexistente", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByIdWithPayment).mockResolvedValue(null);

    const service = new FamilyMemberService(repository);
    const result = await service.deleteWithPayment(99);

    expect(result).toEqual({
      success: false,
      error: "Familiar com ID 99 não encontrado.",
    });
  });

  it("deleta pagamento vinculado antes de deletar familiar", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByIdWithPayment).mockResolvedValue({
      id: 3,
      name: "Filho",
      age: 9,
      atiradorId: 2,
      paymentId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      payment: {
        id: 10,
        status: "PAID",
        value: 50,
        method: "PIX",
        atiradorId: undefined,
        familyMemberId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      atirador: {
        id: 2,
        name: "Atirador",
        number: 12,
        year: 2026,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const service = new FamilyMemberService(repository);
    const result = await service.deleteWithPayment(3);

    expect(result).toEqual({ success: true });
    expect(repository.deletePaymentById).toHaveBeenCalledWith(10);
    expect(repository.deleteById).toHaveBeenCalledWith(3);
  });
});
