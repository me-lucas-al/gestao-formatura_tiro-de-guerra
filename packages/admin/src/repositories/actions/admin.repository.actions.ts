"use server";

import { prismaClient } from "@gestao_formatura/shared";
import {
  AdminEntitySchema,
  type CreateAdminWithPasswordInput,
} from "../../dto/admin.schema";
import type { IAdminRepository } from "../interfaces/admin.repository.interface";

export const findByName: IAdminRepository["findByName"] = async (name) => {
  const admin = await prismaClient.admin.findFirst({
    where: { name },
    omit: { password: true },
  });

  if (!admin) {
    return null;
  }

  return AdminEntitySchema.parse(admin);
};

export const create: IAdminRepository["create"] = async (
  input: CreateAdminWithPasswordInput,
) => {
  const admin = await prismaClient.admin.create({
    data: {
      name: input.name,
      role: input.role,
      year: input.year,
      password: input.passwordHash,
    },
    omit: { password: true },
  });

  return AdminEntitySchema.parse(admin);
};

export const deleteById: IAdminRepository["deleteById"] = async (id) => {
  await prismaClient.admin.delete({ where: { id } });
};

export const updatePassword: IAdminRepository["updatePassword"] = async (
  id,
  passwordHash,
) => {
  await prismaClient.admin.update({
    where: { id },
    data: { password: passwordHash },
  });
};

export const findMany: IAdminRepository["findMany"] = async () => {
  const admins = await prismaClient.admin.findMany({
    omit: { password: true },
    orderBy: { createdAt: "desc" },
  });

  return admins.map((admin: unknown) => AdminEntitySchema.parse(admin));
};

export const adminRepository: IAdminRepository = {
  findByName,
  create,
  deleteById,
  updatePassword,
  findMany,
};
