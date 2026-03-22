import { describe, expect, it, vi } from "vitest";
import type { IDashboardRepository } from "../../src/repositories/interfaces/dashboard.repository.interface";
import { DashboardService } from "../../src/services/dashboard.service";

const createRepositoryMock = (): IDashboardRepository => ({
  getAtiradores: vi.fn(),
  getFamilyMembers: vi.fn(),
  getTotalArrecadado: vi.fn(),
});

describe("DashboardService", () => {
  it("retorna erro com filtros inválidos", async () => {
    const repository = createRepositoryMock();
    const service = new DashboardService(repository);

    const result = await service.getDashboard("invalido", 2026);

    expect(result).toEqual({
      success: false,
      error: "Filtros inválidos.",
    });
  });

  it("monta filtros e agrega respostas do repositório", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.getAtiradores).mockResolvedValue([
      {
        id: 1,
        name: "Atirador",
        number: 10,
        year: 2026,
        payment: null,
        familyMembers: [],
      },
    ] as never);
    vi.mocked(repository.getFamilyMembers).mockResolvedValue([
      {
        id: 2,
        name: "Familiar",
        age: 18,
        atiradorId: 1,
        payment: null,
      },
    ] as never);
    vi.mocked(repository.getTotalArrecadado).mockResolvedValue(250);

    const service = new DashboardService(repository);

    const result = await service.getDashboard(
      {
        atirador_name: "João",
        atirador_number: "15",
        atirador_status: "PAID",
        family_name: "Maria",
        family_status: "PENDING",
      },
      2026,
    );

    expect(repository.getAtiradores).toHaveBeenCalledWith({
      year: 2026,
      name: "João",
      number: 15,
      status: "PAID",
    });

    expect(repository.getFamilyMembers).toHaveBeenCalledWith({
      year: 2026,
      name: "Maria",
      status: "PENDING",
    });

    expect(repository.getTotalArrecadado).toHaveBeenCalledWith(2026);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalArrecadado).toBe(250);
      expect(result.data.atiradores).toHaveLength(1);
      expect(result.data.familyMembers).toHaveLength(1);
    }
  });

  it("usa defaults quando filtros não são enviados", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.getAtiradores).mockResolvedValue([]);
    vi.mocked(repository.getFamilyMembers).mockResolvedValue([]);
    vi.mocked(repository.getTotalArrecadado).mockResolvedValue(0);

    const service = new DashboardService(repository);
    await service.getDashboard({}, 2027);

    expect(repository.getAtiradores).toHaveBeenCalledWith({
      year: 2027,
      name: undefined,
      number: undefined,
      status: "ALL",
    });

    expect(repository.getFamilyMembers).toHaveBeenCalledWith({
      year: 2027,
      name: undefined,
      status: "ALL",
    });
  });
});
