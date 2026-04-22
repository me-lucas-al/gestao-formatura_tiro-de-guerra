"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { FamilyMemberService } from "@/services/family-member-service";
import {
  createFamilyMemberSchema,
  updateFamilyMemberSchema,
  deleteFamilyMemberSchema,
  type CreateFamilyMemberData,
  type UpdateFamilyMemberData,
} from "@packages/schemas/family-member.schema";
import type { PaymentStatus, PaymentMethod } from "@prisma/client";

export async function getFamilyMembers(filters?: {
  name?: string;
  status?: string;
}) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };
    const scopedYear =
      auth.admin.activeYear ?? auth.admin.year ?? new Date().getFullYear();

    const familyMembers = await FamilyMemberService.findMany({
      year: scopedYear,
      name: filters?.name || undefined,
      status: filters?.status || undefined,
    });

    return { success: true, data: familyMembers };
  } catch (error) {
    console.error("Erro ao buscar familiares:", error);
    return { error: "Erro interno ao buscar familiares." };
  }
}

export async function createFamilyMember(data: CreateFamilyMemberData) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const parsed = createFamilyMemberSchema.safeParse(data);
    if (!parsed.success) {
      return { error: "Dados inválidos.", issues: parsed.error.format() };
    }

    const { name, age, atiradorId, payment } = parsed.data;

    const newFamilyMember = await FamilyMemberService.create({
      name,
      age,
      atiradorId,
      payment: payment
        ? {
            status: payment.status as PaymentStatus,
            value: payment.value ?? 0,
            method: (payment.method || "CASH") as PaymentMethod,
          }
        : undefined,
    });

    revalidatePath("/dashboard");
    revalidatePath("/familiares");

    return { success: true, data: newFamilyMember };
  } catch (error) {
    console.error("Erro ao criar familiar:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}

export async function updateFamilyMember(
  id: number,
  data: UpdateFamilyMemberData,
) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const parsed = updateFamilyMemberSchema.safeParse(data);
    if (!parsed.success) {
      return { error: "Dados inválidos.", issues: parsed.error.format() };
    }

    const { name, age, payment } = parsed.data;

    const updatedFamilyMember = await FamilyMemberService.update(id, {
      name,
      age,
      payment: payment
        ? {
            status: payment.status as PaymentStatus,
            value: payment.value ?? 0,
            method: (payment.method || "CASH") as PaymentMethod,
          }
        : undefined,
    });

    revalidatePath("/dashboard");
    revalidatePath("/familiares");

    return { success: true, data: updatedFamilyMember };
  } catch (error) {
    console.error("Erro ao atualizar familiar:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}

export async function deleteFamilyMember(id: number) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const parsed = deleteFamilyMemberSchema.safeParse({ id });
    if (!parsed.success) {
      return { error: "ID inválido." };
    }

    const deleted = await FamilyMemberService.deleteWithPayment(id);
    if (!deleted) {
      return { error: `Familiar com ID ${id} não encontrado.` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/familiares");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar familiar:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}
