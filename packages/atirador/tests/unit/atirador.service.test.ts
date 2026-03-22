import { describe, expect, it, vi } from "vitest";
import type { IAtiradorRepository } from "../../src/repositories/interfaces/atirador.repository.interface";
import { AtiradorService } from "../../src/services/atirador.service";

const createRepositoryMock = (): IAtiradorRepository => ({
  findMany: vi.fn(),
  findByNumber: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findByIdWithRelations: vi.fn(),
  deleteFamilyMemberPaymentById: vi.fn(),
  deleteFamilyMemberById: vi.fn(),
  deletePaymentById: vi.fn(),
  deleteAtiradorById: vi.fn(),
  sumPaidAtiradorPaymentsByYear: vi.fn(),
  sumPaidFamilyMemberPaymentsByYear: vi.fn(),
});

describe("AtiradorService", () => {
  it("retorna erro ao criar quando número já existe no ano", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByNumber).mockResolvedValue({
      id: 1,
      name: "Existente",
      number: 12,
      year: 2026,
      adminId: 3,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      payment: null,
      familyMembers: [],
    });

    const service = new AtiradorService(repository);

    const result = await service.create({
      name: "Novo",
      number: 12,
      year: 2026,
      adminId: 1,
    });

    expect(result).toEqual({
      success: false,
      error: "Já existe um atirador com o número 12.",
    });
  });

  it("cria atirador quando número não existe no ano", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByNumber).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue({
      id: 2,
      name: "Novo",
      number: 33,
      year: 2026,
      adminId: 1,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      payment: null,
      familyMembers: [],
    });

    const service = new AtiradorService(repository);

    const result = await service.create({
      name: "Novo",
      number: 33,
      year: 2026,
      adminId: 1,
    });

    expect(result.success).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("remove atirador com familiares e pagamentos vinculados", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByIdWithRelations).mockResolvedValue({
      id: 8,
      name: "Atirador",
      number: 88,
      year: 2026,
      adminId: 1,
      paymentId: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      payment: {
        id: 200,
        status: "PAID",
        value: 100,
        method: "CASH",
        atiradorId: 8,
        familyMemberId: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      familyMembers: [
        {
          id: 30,
          name: "Familiar",
          age: 20,
          atiradorId: 8,
          paymentId: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
          payment: {
            id: 300,
            status: "PAID",
            value: 80,
            method: "PIX",
            atiradorId: undefined,
            familyMemberId: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
    });

    const service = new AtiradorService(repository);

    const result = await service.deleteWithRelations(8);

    expect(result).toEqual({ success: true });
    expect(repository.deleteFamilyMemberPaymentById).toHaveBeenCalledWith(300);
    expect(repository.deleteFamilyMemberById).toHaveBeenCalledWith(30);
    expect(repository.deletePaymentById).toHaveBeenCalledWith(200);
    expect(repository.deleteAtiradorById).toHaveBeenCalledWith(8);
  });

  it("retorna erro quando atirador não é encontrado na deleção", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByIdWithRelations).mockResolvedValue(null);

    const service = new AtiradorService(repository);
    const result = await service.deleteWithRelations(99);

    expect(result).toEqual({
      success: false,
      error: "Atirador com ID 99 não encontrado.",
    });
  });

  it("soma total arrecadado de atiradores e familiares", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.sumPaidAtiradorPaymentsByYear).mockResolvedValue(180);
    vi.mocked(repository.sumPaidFamilyMemberPaymentsByYear).mockResolvedValue(70);

    const service = new AtiradorService(repository);
    const result = await service.getTotalArrecadado(2026);

    expect(result).toEqual({ success: true, data: 250 });
  });
});
