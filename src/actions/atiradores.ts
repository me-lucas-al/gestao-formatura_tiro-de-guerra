"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  UpdateAtiradorData,
  updateAtiradorSchema,
  deleteAtiradorSchema,
  CreateAtiradorData,
  createAtiradorSchema,
} from "@packages/schemas/atirador.schema";

export async function getAtiradores() {
  try {
    const atiradores = await db.atirador.findMany({
      orderBy: {
        number: "asc",
      },
      include: {
        payment: true,
        admin: true,
        familyMembers: {
          include: {
            payment: true,
          },
        },
      },
    });
    return { success: true, data: atiradores };
  } catch (error) {
    console.error("Erro ao buscar atiradores:", error);
    return { error: "Erro interno ao buscar atiradores." };
  }
}

export async function createAtirador(data: CreateAtiradorData) {
  try {
    const parsedData = createAtiradorSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Dados inválidos.", issues: parsedData.error.format() };
    }

    const { name, number, payment } = parsedData.data;

    const atiradorExists = await db.atirador.findFirst({
      where: { number },
    });

    if (atiradorExists) {
      return { error: `Já existe um atirador com o número ${number}.` };
    }

    const newAtirador = await db.atirador.create({
      data: {
        name,
        number,
        payment: payment
          ? {
              create: {
                status: payment.status,
                value: payment.value || 0,
                method: payment.method || "CASH",
              },
            }
          : undefined,
      },
      include: {
        payment: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/atiradores");

    return { success: true, data: newAtirador };
  } catch (error) {
    console.error("Erro ao criar atirador:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}

export async function updateAtirador(id: number, data: UpdateAtiradorData) {
  try {
    const parsedData = updateAtiradorSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Dados inválidos.", issues: parsedData.error.format() };
    }

    const { name, number, payment } = parsedData.data;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (number !== undefined) updateData.number = number;

    if (payment) {
      updateData.payment = {
        upsert: {
          create: {
            status: payment.status,
            value: payment.value || 0,
            method: payment.method || "CASH",
          },
          update: {
            status: payment.status,
            value: payment.value,
            method: payment.method,
          },
        },
      };
    }

    const atirador = await db.atirador.update({
      where: { id },
      data: updateData,
      include: {
        payment: true,
      },
    });

    // Revalidar os caminhos onde os atiradores são exibidos
    revalidatePath("/dashboard");
    revalidatePath("/atiradores");

    return { success: true, data: atirador };
  } catch (error) {
    console.error("Erro ao atualizar atirador:", error);
    return { error: "Erro interno ao atualizar atirador." };
  }
}

export async function deleteAtirador(id: number) {
  try {
    const parsed = deleteAtiradorSchema.safeParse({ id });

    if (!parsed.success) {
      return { error: "ID inválido." };
    }

    const atiradorExists = await db.atirador.findUnique({
      where: { id },
      include: {
        payment: true,
        familyMembers: {
          include: { payment: true },
        },
      },
    });

    if (!atiradorExists) {
      return { error: `Atirador com ID ${id} não encontrado.` };
    }

    // Delete family members payments, then family members
    for (const member of atiradorExists.familyMembers) {
      if (member.payment) {
        await db.payment.delete({ where: { id: member.payment.id } });
      }
      await db.familyMember.delete({ where: { id: member.id } });
    }

    // Delete atirador payment
    if (atiradorExists.payment) {
      await db.payment.delete({ where: { id: atiradorExists.payment.id } });
    }

    await db.atirador.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/atiradores");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar atirador:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}
