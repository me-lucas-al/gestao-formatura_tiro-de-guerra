"use server";

import bcrypt from "bcrypt";
import {
  ChangePasswordSchema,
  CreateAdminSchema,
  DeleteAdminSchema,
  type AdminActor,
} from "../dto/admin.schema";
import { AdminErrorSchema } from "../dto/admin-result.schema";
import { adminRepository } from "../repositories/actions/admin.repository.actions";
import { AdminService } from "../services/admin.service";

const createAdminService = () => new AdminService(adminRepository);

export const createAdminController = async (
  input: unknown,
  actor: AdminActor,
) => {
  const parsedInput = CreateAdminSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return AdminErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Validação falhou. Verifique os campos.",
    });
  }

  const service = createAdminService();
  const passwordHash = await bcrypt.hash("admin123", 10);

  return service.createAdmin(parsedInput.data, passwordHash, actor);
};

export const changeAdminPasswordController = async (
  input: unknown,
  actor: AdminActor,
) => {
  const parsedInput = ChangePasswordSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return AdminErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createAdminService();
  const passwordHash = await bcrypt.hash(parsedInput.data.newPassword, 10);

  return service.changePassword(parsedInput.data, passwordHash, actor);
};

export const deleteAdminController = async (
  input: unknown,
  actor: AdminActor,
) => {
  const parsedInput = DeleteAdminSchema.safeParse(input);

  if (!parsedInput.success) {
    const issue = parsedInput.error.issues.at(0);

    return AdminErrorSchema.parse({
      success: false,
      error: issue?.message ?? "Dados inválidos.",
    });
  }

  const service = createAdminService();

  return service.deleteAdmin(parsedInput.data, actor);
};

export const listAdminsController = async () => {
  const service = createAdminService();

  return service.listAdmins();
};
