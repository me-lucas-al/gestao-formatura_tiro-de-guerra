"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { AtiradoresService } from "@/services/atiradores-service";
import {
  createAtiradorSchema,
  updateAtiradorSchema,
  deleteAtiradorSchema,
  type CreateAtiradorData,
  type UpdateAtiradorData,
} from "@packages/schemas/atirador.schema";
import type { PaymentStatus, PaymentMethod } from "@prisma/client";

export async function getAtiradores(filters?: {
  name?: string;
  number?: string;
  status?: string;
}) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const atiradores = await AtiradoresService.findMany({
      year: auth.admin.year,
      name: filters?.name || undefined,
      number: filters?.number ? parseInt(filters.number, 10) : undefined,
      status: filters?.status || undefined,
    });

    return { success: true, data: atiradores };
  } catch (error) {
    console.error("Erro ao buscar atiradores:", error);
    return { error: "Erro interno ao buscar atiradores." };
  }
}

export async function createAtirador(data: CreateAtiradorData) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const parsed = createAtiradorSchema.safeParse(data);
    if (!parsed.success) {
      return { error: "Dados inválidos.", issues: parsed.error.format() };
    }

    const { name, number, payment } = parsed.data;

    const exists = await AtiradoresService.findByNumber(
      number,
      auth.admin.year,
    );
    if (exists) {
      return { error: `Já existe um atirador com o número ${number}.` };
    }

    const newAtirador = await AtiradoresService.create({
      name,
      number,
      year: auth.admin.year,
      adminId: auth.admin.id,
      payment: payment
        ? {
            status: payment.status as PaymentStatus,
            value: payment.value || 0,
            method: (payment.method || "CASH") as PaymentMethod,
          }
        : undefined,
    });

    revalidatePath("/dashboard");
    return { success: true, data: newAtirador };
  } catch (error) {
    console.error("Erro ao criar atirador:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}

export async function updateAtirador(id: number, data: UpdateAtiradorData) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const parsed = updateAtiradorSchema.safeParse(data);
    if (!parsed.success) {
      return { error: "Dados inválidos.", issues: parsed.error.format() };
    }

    const { name, number, payment } = parsed.data;

    const atirador = await AtiradoresService.update(id, {
      name,
      number,
      payment: payment
        ? {
            status: payment.status as PaymentStatus,
            value: payment.value ?? 0,
            method: (payment.method || "CASH") as PaymentMethod,
          }
        : undefined,
    });

    revalidatePath("/dashboard");
    return { success: true, data: atirador };
  } catch (error) {
    console.error("Erro ao atualizar atirador:", error);
    return { error: "Erro interno ao atualizar atirador." };
  }
}

export async function deleteAtirador(id: number) {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const parsed = deleteAtiradorSchema.safeParse({ id });
    if (!parsed.success) {
      return { error: "ID inválido." };
    }

    const deleted = await AtiradoresService.deleteWithRelations(id);
    if (!deleted) {
      return { error: `Atirador com ID ${id} não encontrado.` };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar atirador:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}

export async function getTotalArrecadado() {
  try {
    const auth = await requireAuth();
    if (!auth.success) return { error: auth.error };

    const total = await AtiradoresService.getTotalArrecadado(auth.admin.year);
    return { success: true, data: total };
  } catch (error) {
    console.error("Erro ao calcular total arrecadado:", error);
    return { error: "Erro interno ao calcular total." };
  }
}
