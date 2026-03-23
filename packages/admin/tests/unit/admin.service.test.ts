import { describe, expect, it, vi } from "vitest";
import type { IAdminRepository } from "../../src/repositories/interfaces/admin.repository.interface";
import { AdminService } from "../../src/services/admin.service";

const makeAdmin = (overrides = {}) => ({
  id: 1,
  name: "admin",
  email: null,
  role: "ADMIN" as const,
  year: 2026,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const createRepositoryMock = (): IAdminRepository => ({
  findByName: vi.fn(),
  create: vi.fn(),
  deleteById: vi.fn(),
  updatePassword: vi.fn(),
  findMany: vi.fn(),
});

describe("AdminService — createAdmin", () => {
  it("superadmin pode criar admin", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByName).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue(
      makeAdmin({ id: 2, name: "novo", role: "ADMIN" }),
    );

    const service = new AdminService(repository);
    const result = await service.createAdmin(
      { name: "novo", role: "ADMIN", year: 2026 },
      "hash",
      { id: 99, role: "SUPER_ADMIN", year: 2026 },
    );

    expect(result.success).toBe(true);
    expect(repository.create).toHaveBeenCalledWith({
      name: "novo",
      role: "ADMIN",
      year: 2026,
      passwordHash: "hash",
    });
  });

  it("admin comum tenta criar admin → lança erro", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.createAdmin(
      { name: "novo", role: "ADMIN", year: 2026 },
      "hash",
      { id: 1, role: "ADMIN", year: 2026 },
    );

    expect(result).toEqual({
      success: false,
      error: "Acesso negado. Apenas superadmins podem criar administradores.",
    });
    expect(repository.create).not.toHaveBeenCalled();
    expect(repository.findByName).not.toHaveBeenCalled();
  });

  it("superadmin pode promover (criar com role SUPER_ADMIN)", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByName).mockResolvedValue(null);
    vi.mocked(repository.create).mockResolvedValue(
      makeAdmin({ id: 3, name: "chefe", role: "SUPER_ADMIN" }),
    );

    const service = new AdminService(repository);
    const result = await service.createAdmin(
      { name: "chefe", role: "SUPER_ADMIN", year: 2030 },
      "hash",
      { id: 99, role: "SUPER_ADMIN", year: 2026 },
    );

    expect(result.success).toBe(true);
    expect(repository.create).toHaveBeenCalledWith({
      name: "chefe",
      role: "SUPER_ADMIN",
      year: 2030,
      passwordHash: "hash",
    });
  });

  it("admin comum tenta promover (criar com SUPER_ADMIN) → lança erro", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.createAdmin(
      { name: "chefe", role: "SUPER_ADMIN", year: 2026 },
      "hash",
      { id: 1, role: "ADMIN", year: 2026 },
    );

    expect(result).toEqual({
      success: false,
      error: "Acesso negado. Apenas superadmins podem criar administradores.",
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("retorna erro ao criar admin com nome já existente", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findByName).mockResolvedValue(makeAdmin({ name: "existente" }));

    const service = new AdminService(repository);
    const result = await service.createAdmin(
      { name: "existente", role: "ADMIN", year: 2027 },
      "hash",
      { id: 10, role: "SUPER_ADMIN", year: 2026 },
    );

    expect(result).toEqual({
      success: false,
      error: "Este nome já está em uso por outro administrador.",
    });
  });
});

describe("AdminService — changePassword", () => {
  it("nega troca de senha quando ator não pode alterar outro admin", async () => {
    const repository = createRepositoryMock();
    const service = new AdminService(repository);

    const result = await service.changePassword(
      { adminId: 2, newPassword: "123456", confirmPassword: "123456" },
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
      { adminId: 1, newPassword: "123456", confirmPassword: "123456" },
      "hash",
      { id: 1, role: "ADMIN", year: 2026 },
    );

    expect(repository.updatePassword).toHaveBeenCalledWith(1, "hash");
    expect(result).toEqual({ success: true, message: "Senha alterada com sucesso." });
  });
});

describe("AdminService — deleteAdmin", () => {
  it("nega deleção para ator sem permissão (admin comum)", async () => {
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
});

describe("AdminService — listAdmins", () => {
  it("lista admins com sucesso", async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findMany).mockResolvedValue([makeAdmin()]);

    const service = new AdminService(repository);
    const result = await service.listAdmins();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });
});
