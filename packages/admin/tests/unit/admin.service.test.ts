import { describe, expect, it, vi } from "vitest";
import type { IAdminRepository } from "../../src/repositories/interfaces/admin.repository.interface";
import { AdminService } from "../../src/services/admin.service";

const createRepositoryMock = (): IAdminRepository => ({
  findByName: vi.fn(),
  create: vi.fn(),
  deleteById: vi.fn(),
  updatePassword: vi.fn(),
  findMany: vi.fn(),
});

describe("AdminService", () => {
  it("retorna erro ao criar admin com nome já existente", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByName).mockResolvedValue({
      id: 1,
      name: "existente",
      email: null,
      role: "ADMIN",
      year: 2026,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = new AdminService(repository);

    const result = await service.createAdmin(
      { name: "existente", role: "SUPER_ADMIN", year: 2027 },
      "hash",
      { id: 10, role: "SUPER_ADMIN", year: 2026 },
    );

    expect(result).toEqual({
      success: false,
      error: "Este nome já está em uso por outro administrador.",
    });
  });

  it("força role ADMIN e year do ator quando ator não é SUPER_ADMIN", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByName).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue({
      id: 2,
      name: "novo",
      email: null,
      role: "ADMIN",
      year: 2025,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = new AdminService(repository);

    const result = await service.createAdmin(
      { name: "novo", role: "SUPER_ADMIN", year: 2030 },
      "hash",
      { id: 1, role: "ADMIN", year: 2025 },
    );

    expect(result.success).toBe(true);
    expect(repository.create).toHaveBeenCalledWith({
      name: "novo",
      role: "ADMIN",
      year: 2025,
      passwordHash: "hash",
    });
  });

  it("permite SUPER_ADMIN criar com role e year informados", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByName).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue({
      id: 3,
      name: "chefe",
      email: null,
      role: "SUPER_ADMIN",
      year: 2030,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = new AdminService(repository);

    await service.createAdmin(
      { name: "chefe", role: "SUPER_ADMIN", year: 2030 },
      "hash",
      { id: 99, role: "SUPER_ADMIN", year: 2026 },
    );

    expect(repository.create).toHaveBeenCalledWith({
      name: "chefe",
      role: "SUPER_ADMIN",
      year: 2030,
      passwordHash: "hash",
    });
  });

  it("nega troca de senha quando ator não pode alterar outro admin", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.changePassword(
      {
        adminId: 2,
        newPassword: "123456",
        confirmPassword: "123456",
      },
      "hash",
      { id: 1, role: "ADMIN", year: 2026 },
    );

    expect(result).toEqual({ success: false, error: "Acesso negado." });
    expect(repository.updatePassword).not.toHaveBeenCalled();
  });

  it("permite troca da própria senha", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.changePassword(
      {
        adminId: 1,
        newPassword: "123456",
        confirmPassword: "123456",
      },
      "hash",
      { id: 1, role: "ADMIN", year: 2026 },
    );

    expect(repository.updatePassword).toHaveBeenCalledWith(1, "hash");
    expect(result).toEqual({ success: true, message: "Senha alterada com sucesso." });
  });

  it("nega deleção para ator sem permissão", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.deleteAdmin(
      { adminId: 5 },
      { id: 1, role: "ADMIN", year: 2026 },
    );

    expect(result).toEqual({
      success: false,
      error: "Acesso negado. Permissão insuficiente.",
    });
  });

  it("nega auto deleção de super admin", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.deleteAdmin(
      { adminId: 1 },
      { id: 1, role: "SUPER_ADMIN", year: 2026 },
    );

    expect(result).toEqual({
      success: false,
      error: "Você não pode remover a si mesmo.",
    });
  });

  it("lista admins com sucesso", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findMany).mockResolvedValue([
      {
        id: 1,
        name: "admin",
        email: null,
        role: "ADMIN",
        year: 2026,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const service = new AdminService(repository);
    const result = await service.listAdmins();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });
});
