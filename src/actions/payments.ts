"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createPaymentSchema,
  updatePaymentSchema,
} from "@/schemas/payment/create-payment-schema";
import { z } from "zod";

type CreatePaymentType = z.infer<typeof createPaymentSchema>;
type UpdatePaymentType = z.infer<typeof updatePaymentSchema>;

export async function createPayment(data: CreatePaymentType) {
  try {
    const parsedData = createPaymentSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Dados inválidos.", issues: parsedData.error.format() };
    }

    const { atiradorId, familyMemberId } = parsedData.data;

    if (!atiradorId && !familyMemberId) {
      return {
        error: "O pagamento deve ser associado a um atirador ou a um familiar.",
      };
    }

    if (atiradorId && familyMemberId) {
      return {
        error:
          "O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.",
      };
    }

    if (atiradorId) {
      const atiradorExists = await db.atirador.findUnique({
        where: { id: atiradorId },
      });
      if (!atiradorExists) {
        return { error: `Atirador com ID ${atiradorId} não encontrado.` };
      }
    }

    if (familyMemberId) {
      const familyMemberExists = await db.familyMember.findUnique({
        where: { id: familyMemberId },
      });
      if (!familyMemberExists) {
        return { error: `Familiar com ID ${familyMemberId} não encontrado.` };
      }
    }

    const newPayment = await db.payment.create({
      data: {
        ...(parsedData.data as any),
        id: undefined,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/pagamentos");

    return { success: true, data: newPayment };
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}

export async function updatePayment(id: number, data: UpdatePaymentType) {
  try {
    if (isNaN(id)) {
      return { error: "ID de pagamento inválido." };
    }

    const existingPayment = await db.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return { error: `Pagamento com ID ${id} não encontrado.` };
    }

    const parsedData = updatePaymentSchema.safeParse(data);

    if (!parsedData.success) {
      return { error: "Dados inválidos.", issues: parsedData.error.format() };
    }

    const { atiradorId, familyMemberId } = parsedData.data;

    if (atiradorId !== undefined && familyMemberId !== undefined) {
      if (atiradorId && familyMemberId) {
        return {
          error:
            "O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.",
        };
      }
    }

    if (atiradorId !== undefined && atiradorId !== null) {
      const atiradorExists = await db.atirador.findUnique({
        where: { id: atiradorId },
      });
      if (!atiradorExists) {
        return { error: `Atirador com ID ${atiradorId} não encontrado.` };
      }
    }

    if (familyMemberId !== undefined && familyMemberId !== null) {
      const familyMemberExists = await db.familyMember.findUnique({
        where: { id: familyMemberId },
      });
      if (!familyMemberExists) {
        return { error: `Familiar com ID ${familyMemberId} não encontrado.` };
      }
    }

    const updatedPayment = await db.payment.update({
      where: { id },
      data: parsedData.data as any,
    });

    revalidatePath("/dashboard");
    revalidatePath("/pagamentos");

    return { success: true, data: updatedPayment };
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);
    return { error: "Erro interno ao processar a requisição." };
  }
}
