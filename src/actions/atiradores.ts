"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateAtirador(id: number, data: any) {
  try {
    const atirador = await db.atirador.update({
      where: { id },
      data,
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
    if (isNaN(id)) {
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
