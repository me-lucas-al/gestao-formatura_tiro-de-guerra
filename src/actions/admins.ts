"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { CreateAdminSchema } from "@/schemas/admin";
import { AdminService } from "@/services/admin-service";
import { requireAuth, requireSuperAdmin } from "@/lib/auth";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
};



export async function createAdmin(formData: FormData): Promise<ActionResponse> {
  const auth = await requireAuth();
  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  const isSuperAdmin = auth.admin.role === "SUPER_ADMIN";
  const data = Object.fromEntries(formData.entries());

  const yearValue = isSuperAdmin ? data.year : String(auth.admin.year);
  const roleValue = isSuperAdmin ? data.role : "ADMIN";

  const validatedFields = CreateAdminSchema.safeParse({
    name: data.name,

    role: roleValue,
    year: yearValue,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Validação falhou. Verifique os campos.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, role, year } = validatedFields.data;

  try {
    const existingAdmin = await AdminService.findByName(name);
    if (existingAdmin) {
      return {
        success: false,
        error: "Este nome já está em uso por outro administrador.",
      };
    }

    const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!DEFAULT_PASSWORD) {
      return {
        success: false,
        error: "Senha padrão não configurada.",
      };
    }
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const newAdmin = await AdminService.createAdmin(
      { name, role, year },
      passwordHash,
    );

    revalidatePath("/dashboard/admins");

    return {
      success: true,
      message: "Administrador criado com sucesso! A senha padrão é 'admin123'.",
      data: newAdmin,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = String((error.meta as { target?: unknown })?.target ?? "");

      if (target.includes("name") || target.includes("year")) {
        return {
          success: false,
          error: "Já existe um administrador com este nome de usuário nesta turma.",
        };
      }

      if (target.includes("id")) {
        return {
          success: false,
          error: "Conflito de identificador ao criar administrador. Tente novamente.",
        };
      }
    }

    console.error("Erro ao criar administrador:", error);
    return {
      success: false,
      error:
        "Ocorreu um erro inesperado ao criar o administrador. Tente novamente mais tarde.",
    };
  }
}

const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres.")
      .max(100, "Senha muito longa."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export async function changeAdminPassword(
  adminId: number,
  newPassword: string,
  confirmPassword: string,
): Promise<ActionResponse> {
  const auth = await requireAuth();
  if (!auth.success) return { success: false, error: auth.error };

  if (auth.admin.role !== "SUPER_ADMIN" && auth.admin.id !== adminId) {
    return { success: false, error: "Acesso negado." };
  }

  const validated = ChangePasswordSchema.safeParse({
    newPassword,
    confirmPassword,
  });
  if (!validated.success) {
    const firstIssue = validated.error.flatten().fieldErrors;
    const msg =
      firstIssue.newPassword?.[0] ??
      firstIssue.confirmPassword?.[0] ??
      "Dados inválidos.";
    return { success: false, error: msg };
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await AdminService.changePassword(adminId, passwordHash);
    revalidatePath("/dashboard/admins");
    return { success: true, message: "Senha alterada com sucesso." };
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return {
      success: false,
      error: "Erro ao alterar a senha. Tente novamente.",
    };
  }
}

export async function deleteAdmin(adminId: number): Promise<ActionResponse> {
  const auth = await requireSuperAdmin();
  if (!auth.success) return { success: false, error: auth.error };

  if (auth.admin.id === adminId) {
    return { success: false, error: "Você não pode remover a si mesmo." };
  }

  try {
    await AdminService.deleteAdmin(adminId);
    revalidatePath("/dashboard/admins");
    return { success: true, message: "Administrador removido com sucesso." };
  } catch (error) {
    console.error("Erro ao remover administrador:", error);
    return {
      success: false,
      error: "Erro ao remover o administrador. Tente novamente.",
    };
  }
}
