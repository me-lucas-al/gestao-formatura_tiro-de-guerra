import { describe, expect, it, vi } from "vitest";
import type { IAuthRepository } from "../../src/repositories/interfaces/auth.repository.interface";
import { AuthService } from "../../src/services/auth.service";

const createRepositoryMock = (): IAuthRepository => ({
  findByName: vi.fn(),
  findById: vi.fn(),
  readSessionToken: vi.fn(),
  writeSessionToken: vi.fn(),
  clearSessionToken: vi.fn(),
});

describe("AuthService", () => {
  it("retorna erro quando admin não existe", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    vi.mocked(repository.findByName).mockResolvedValue(null);

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.login({
      adminName: "nao-existe",
      password: "123456",
    });

    expect(result).toEqual({
      success: false,
      error: "Usuário não encontrado",
    });

    expect(comparePassword).not.toHaveBeenCalled();
    expect(signToken).not.toHaveBeenCalled();
  });

  it("retorna erro quando senha está incorreta", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    vi.mocked(repository.findByName).mockResolvedValue({
      id: 1,
      name: "admin",
      email: null,
      password: "hash",
      role: "ADMIN",
      year: 2026,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    comparePassword.mockResolvedValue(false);

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.login({
      adminName: "admin",
      password: "senha-errada",
    });

    expect(result).toEqual({
      success: false,
      error: "Senha incorreta",
    });

    expect(signToken).not.toHaveBeenCalled();
  });

  it("realiza login quando as credenciais são válidas", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    vi.mocked(repository.findByName).mockResolvedValue({
      id: 10,
      name: "admin",
      email: null,
      password: "hash",
      role: "SUPER_ADMIN",
      year: 2026,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    comparePassword.mockResolvedValue(true);
    signToken.mockResolvedValue("token-valido");

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.login({
      adminName: "admin",
      password: "admin123",
    });

    expect(result).toEqual({
      success: true,
      message: "Login realizado com sucesso",
    });

    expect(signToken).toHaveBeenCalledWith({
      id: 10,
      name: "admin",
      role: "SUPER_ADMIN",
      year: 2026,
    });

    expect(repository.writeSessionToken).toHaveBeenCalledWith("token-valido");
  });

  it("retorna erro quando token não existe na sessão", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    vi.mocked(repository.readSessionToken).mockResolvedValue(null);

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.getSession();

    expect(result).toEqual({
      success: false,
      error: "Token não encontrado. Acesso não autorizado.",
      status: 401,
    });
  });

  it("retorna erro quando token é inválido", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    vi.mocked(repository.readSessionToken).mockResolvedValue("token");
    verifyToken.mockRejectedValue(new Error("invalid"));

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.getSession();

    expect(result).toEqual({
      success: false,
      error: "Sessão inválida ou expirada.",
      status: 401,
    });
  });

  it("retorna sessão quando token e admin são válidos", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    vi.mocked(repository.readSessionToken).mockResolvedValue("token");
    verifyToken.mockResolvedValue({
      id: 7,
      name: "admin",
      role: "ADMIN",
      year: 2026,
    });

    vi.mocked(repository.findById).mockResolvedValue({
      id: 7,
      name: "admin",
      email: null,
      role: "ADMIN",
      year: 2026,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.getSession();

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.id).toBe(7);
      expect(result.data.name).toBe("admin");
    }
  });

  it("remove token durante logout", async () => {
    const repository = createRepositoryMock();
    const comparePassword = vi.fn();
    const signToken = vi.fn();
    const verifyToken = vi.fn();

    const service = new AuthService(
      repository,
      comparePassword,
      signToken,
      verifyToken,
    );

    const result = await service.logout();

    expect(repository.clearSessionToken).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      success: true,
      message: "Logout realizado com sucesso",
    });
  });
});
