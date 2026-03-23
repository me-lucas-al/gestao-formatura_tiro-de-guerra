import {
  AdminErrorSchema,
  type ChangePasswordResult,
  type CreateAdminResult,
  type DeleteAdminResult,
  type ListAdminResult,
} from "../dto/admin-result.schema";
import type {
  AdminActor,
  ChangePasswordInput,
  CreateAdminInput,
  DeleteAdminInput,
} from "../dto/admin.schema";
import type { IAdminRepository } from "../repositories/interfaces/admin.repository.interface";

export class AdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async createAdmin(
    input: CreateAdminInput,
    passwordHash: string,
    actor: AdminActor,
  ): Promise<CreateAdminResult> {
    if (actor.role !== "SUPER_ADMIN") {
      return AdminErrorSchema.parse({
        success: false,
        error: "Acesso negado. Apenas superadmins podem criar administradores.",
      });
    }

    const existingAdmin = await this.adminRepository.findByName(input.name);

    if (existingAdmin) {
      return AdminErrorSchema.parse({
        success: false,
        error: "Este nome já está em uso por outro administrador.",
      });
    }

    const admin = await this.adminRepository.create({
      name: input.name,
      role: input.role,
      year: input.year,
      passwordHash,
    });

    return {
      success: true,
      message: "Administrador criado com sucesso! A senha padrão é 'admin123'.",
      data: admin,
    };
  }

  async changePassword(
    input: ChangePasswordInput,
    passwordHash: string,
    actor: AdminActor,
  ): Promise<ChangePasswordResult> {
    const canChangeOwnPassword = actor.id === input.adminId;

    if (actor.role !== "SUPER_ADMIN" && !canChangeOwnPassword) {
      return AdminErrorSchema.parse({
        success: false,
        error: "Acesso negado.",
      });
    }

    await this.adminRepository.updatePassword(input.adminId, passwordHash);

    return { success: true, message: "Senha alterada com sucesso." };
  }

  async deleteAdmin(
    input: DeleteAdminInput,
    actor: AdminActor,
  ): Promise<DeleteAdminResult> {
    if (actor.role !== "SUPER_ADMIN") {
      return AdminErrorSchema.parse({
        success: false,
        error: "Acesso negado. Permissão insuficiente.",
      });
    }

    if (actor.id === input.adminId) {
      return AdminErrorSchema.parse({
        success: false,
        error: "Você não pode remover a si mesmo.",
      });
    }

    await this.adminRepository.deleteById(input.adminId);

    return { success: true, message: "Administrador removido com sucesso." };
  }

  async listAdmins(): Promise<ListAdminResult> {
    const admins = await this.adminRepository.findMany();

    return { success: true, data: admins };
  }
}
