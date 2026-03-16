"use server";

import { getSession } from "@/actions/login";
import type { AdminEntity } from "@/schemas/admin";

type AuthSuccess = { success: true; admin: AdminEntity };
type AuthError = { success: false; error: string };
export type AuthResult = AuthSuccess | AuthError;

export async function requireAuth(): Promise<AuthResult> {
  const session = await getSession();
  if (!session.success || !session.data) {
    return { success: false, error: "Acesso negado. Autenticação necessária." };
  }
  return { success: true, admin: session.data };
}

export async function requireSuperAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  if (!result.success) return result;
  if (result.admin.role !== "SUPER_ADMIN") {
    return { success: false, error: "Acesso negado. Permissão insuficiente." };
  }
  return result;
}
