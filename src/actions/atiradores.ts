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
