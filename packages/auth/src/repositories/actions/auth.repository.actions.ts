"use server";

import { prismaClient } from "@gestao_formatura/shared";
import { cookies } from "next/headers";
import { AuthAdminCredentialsSchema, AuthAdminSessionSchema } from "../../dto/auth-admin.schema";
import type { IAuthRepository } from "../interfaces/auth.repository.interface";

export const findByName: IAuthRepository["findByName"] = async (name) => {
  const admin = await prismaClient.admin.findFirst({
    where: { name },
  });

  if (!admin) {
    return null;
  }

  return AuthAdminCredentialsSchema.parse(admin);
};

export const findById: IAuthRepository["findById"] = async (id) => {
  const admin = await prismaClient.admin.findUnique({
    where: { id },
    omit: { password: true },
  });

  if (!admin) {
    return null;
  }

  return AuthAdminSessionSchema.parse(admin);
};

export const readSessionToken: IAuthRepository["readSessionToken"] = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  return token;
};

export const writeSessionToken: IAuthRepository["writeSessionToken"] = async (
  token,
) => {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
};

export const clearSessionToken: IAuthRepository["clearSessionToken"] =
  async () => {
    const cookieStore = await cookies();

    cookieStore.delete("token");
  };

export const authRepository: IAuthRepository = {
  findByName,
  findById,
  readSessionToken,
  writeSessionToken,
  clearSessionToken,
};
