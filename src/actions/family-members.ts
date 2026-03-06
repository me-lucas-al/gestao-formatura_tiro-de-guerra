"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreateFamilyMemberData,
  UpdateFamilyMemberData,
  createFamilyMemberSchema,
  updateFamilyMemberSchema,
  deleteFamilyMemberSchema,
} from "@packages/schemas/family-member.schema";

export async function getFamilyMembers() {
  try {
    const familyMembers = await db.familyMember.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        payment: true,
        atirador: true,
      },
    });
    return { success: true, data: familyMembers };
  } catch (error) {
    console.error("Erro ao buscar familiares:", error);
    return { error: "Erro interno ao buscar familiares." };
  }
}

export async function createFamilyMember(data: CreateFamilyMemberData) {
  try {
    const parsed = createFamilyMemberSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Dados inválidos.", issues: parsed.error.format() };
    }

    const { name, age, atiradorId, payment } = parsed.data;

    const atirador = await db.atirador.findUnique({
      where: { id: atiradorId },
    });

    if (!atirador) {
      return { error: `Atirador com ID ${atiradorId} não encontrado.` };
    }

    const newFamilyMember = await db.familyMember.create({
      data: {
        name,
        age,
        atirador: {
          connect: { id: atiradorId },
        },
        payment: payment
          ? {
              create: {
                status: payment.status as any,
                value: payment.value ?? 0,
                method: payment.method as any,
              },
            }
          : undefined,
      },
      include: {
        payment: true,
        atirador: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/familiares"); // Assuming there's a list somewhere that needs revalidation

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
    if (isNaN(id)) {
      return { error: "ID inválido." };
    }

    const parsed = updateFamilyMemberSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Dados inválidos.", issues: parsed.error.format() };
    }

    const { name, age, payment } = parsed.data;

    const familyMemberExists = await db.familyMember.findUnique({
      where: { id },
    });

    if (!familyMemberExists) {
      return { error: `Familiar com ID ${id} não encontrado.` };
    }

    const updatedFamilyMember = await db.familyMember.update({
      where: { id },
      data: {
        name,
        age,
        payment: payment
          ? {
              upsert: {
                create: {
                  status: payment.status as any,
                  value: payment.value ?? 0,
                  method: (payment.method || "CASH") as any,
                },
                update: {
                  status: payment.status as any,
                  value: payment.value,
                  method: payment.method as any,
                },
              },
            }
          : undefined,
      },
      include: {
        payment: true,
        atirador: true,
      },
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
    const parsed = deleteFamilyMemberSchema.safeParse({ id });

    if (!parsed.success) {
      return { error: "ID inválido." };
    }

    const familyMemberExists = await db.familyMember.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!familyMemberExists) {
      return { error: `Familiar com ID ${id} não encontrado.` };
    }

    // Prisma handles cascading deletes if configured in schema,
    // otherwise we might need to delete the payment first if it exists.
    // Assuming schema handles the relationship correctly, otherwise:
    if (familyMemberExists.payment) {
      await db.payment.delete({ where: { id: familyMemberExists.payment.id } });
    }

    await db.familyMember.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/familiares");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar familiar:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}
