// src/app/api/familyMembers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createFamilyMemberSchema } from "@/schemas/family-members/family-member-schema";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createFamilyMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos.", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, age, atiradorId, payment } = parsed.data;

    const atirador = await prisma.atirador.findUnique({
      where: { id: atiradorId },
    });

    if (!atirador) {
      return NextResponse.json(
        { message: `Atirador com ID ${atiradorId} não encontrado.` },
        { status: 404 }
      );
    }

    // Cria o familiar e o pagamento em uma única operação atômica
    const newFamilyMember = await prisma.familyMember.create({
      data: {
        name,
        age,
        atirador: {
          connect: { id: atiradorId },
        },
        payment: {
          create: {
            status: payment.status,
            value: payment.value,
            method: payment.method,
          },
        },
      },
      include: {
        payment: true,
        atirador: true,
      },
    });

    console.log("Familiar criado com sucesso:", newFamilyMember);

    return NextResponse.json(newFamilyMember, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos.", issues: error.format() },
        { status: 400 }
      );
    }
    console.error("Erro ao criar familiar:", error);
    return NextResponse.json(
      { message: "Erro interno ao processar a requisição." },
      { status: 500 }
    );
  }
}
