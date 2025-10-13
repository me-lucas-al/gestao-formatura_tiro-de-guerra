import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createFamilyMemberSchema } from "@/schemas/login/create-family-member-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = createFamilyMemberSchema.parse(body);

    const atiradorExists = await prisma.atirador.findUnique({
      where: {
        id: parsedData.atiradorId,
      },
    });

    if (!atiradorExists) {
      return NextResponse.json(
        { message: `Atirador com ID ${parsedData.atiradorId} não encontrado.` },
        { status: 404 }
      );
    }

    const newFamilyMember = await prisma.familyMember.create({
      data: {
        name: parsedData.name,
        atiradorId: parsedData.atiradorId,
      },
      include: {
        atirador: true,
      },
    });

    const newPayment = await prisma.payment.create({
      data: {
        value: parsedData.paymentValue,
        method: parsedData.paymentMethod,
        familyMemberId: newFamilyMember.id,
      },
    });

    const response = {
      ...newFamilyMember,
      payment: newPayment,
    };

    return NextResponse.json(response, { status: 201 });
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
