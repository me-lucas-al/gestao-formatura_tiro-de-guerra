import { describe, expect, it, vi } from "vitest";
import type { IPaymentRepository } from "../../src/repositories/interfaces/payment.repository.interface";
import { PaymentService } from "../../src/services/payment.service";

const createRepositoryMock = (): IPaymentRepository => ({
  findAtiradorById: vi.fn(),
  findFamilyMemberById: vi.fn(),
  findPaymentById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
});

describe("PaymentService", () => {
  it("retorna erro ao criar sem associacao", async () => {
    const repository = createRepositoryMock();
    const service = new PaymentService(repository);

    const result = await service.create({
      status: "PENDING",
      value: 100,
      method: "CASH",
    });

    expect(result).toEqual({
      success: false,
      error: "O pagamento deve ser associado a um atirador ou a um familiar.",
    });
  });

  it("retorna erro ao criar com dupla associacao", async () => {
    const repository = createRepositoryMock();
    const service = new PaymentService(repository);

    const result = await service.create({
      status: "PENDING",
      value: 100,
      method: "CASH",
      atiradorId: 1,
      familyMemberId: 2,
    });

    expect(result).toEqual({
      success: false,
      error:
        "O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.",
    });
  });

  it("retorna erro se atirador nao existe", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findAtiradorById).mockResolvedValue(null);

    const service = new PaymentService(repository);

    const result = await service.create({
      status: "PENDING",
      value: 100,
      method: "PIX",
      atiradorId: 99,
    });

    expect(result).toEqual({
      success: false,
      error: "Atirador com ID 99 não encontrado.",
    });
  });

  it("cria pagamento com sucesso", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findAtiradorById).mockResolvedValue({ id: 1 });
    vi.mocked(repository.create).mockResolvedValue({
      id: 5,
      status: "PAID",
      value: 100,
      method: "PIX",
      atiradorId: 1,
      familyMemberId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = new PaymentService(repository);
    const result = await service.create({
      status: "PAID",
      value: 100,
      method: "PIX",
      atiradorId: 1,
    });

    expect(result.success).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("retorna erro ao atualizar pagamento inexistente", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findPaymentById).mockResolvedValue(null);

    const service = new PaymentService(repository);

    const result = await service.update({
      id: 123,
      status: "PAID",
    });

    expect(result).toEqual({
      success: false,
      error: "Pagamento com ID 123 não encontrado.",
    });
  });

  it("atualiza pagamento com sucesso", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findPaymentById).mockResolvedValue({
      id: 10,
      status: "PENDING",
      value: 50,
      method: "CASH",
      atiradorId: 1,
      familyMemberId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(repository.findAtiradorById).mockResolvedValue({ id: 1 });
    vi.mocked(repository.update).mockResolvedValue({
      id: 10,
      status: "PAID",
      value: 50,
      method: "CASH",
      atiradorId: 1,
      familyMemberId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = new PaymentService(repository);

    const result = await service.update({
      id: 10,
      status: "PAID",
      atiradorId: 1,
    });

    expect(result.success).toBe(true);
    expect(repository.update).toHaveBeenCalledTimes(1);
  });
});
