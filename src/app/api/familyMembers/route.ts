// src/app/api/familyMembers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createFamilyMemberSchema } from "@/schemas/family-members/create-family-member-schema";

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

    const data = parsed.data;

    const atirador = await prisma.atirador.findUnique({
      where: { id: data.atiradorId },
    });

    if (!atirador) {
      return NextResponse.json(
        { message: `Atirador com ID ${data.atiradorId} não encontrado.` },
        { status: 404 }
      );
    }

    // 1️⃣ Cria o familiar
    const familyMember = await prisma.familyMember.create({
      data: {
        name: data.name,
        age: data.age,
        atiradorId: data.atiradorId,
      },
    });

    // 2️⃣ Se houver pagamento, cria e associa
    let payment = null;
    if (data.payment) {
      payment = await prisma.payment.create({
        data: {
          status: data.payment.status ?? PaymentStatus.PENDING,
          value: data.payment.value ?? 0,
          method: data.payment.method ?? PaymentMethod.PIX,
          familyMemberId: familyMember.id,
        },
      });

      await prisma.familyMember.update({
        where: { id: familyMember.id },
        data: { paymentId: payment.id },
      });
    }

    // 3️⃣ Retorna com include
    const newFamilyMember = await prisma.familyMember.findUnique({
      where: { id: familyMember.id },
      include: { payment: true, atirador: true },
    });

    return NextResponse.json(newFamilyMember, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar familiar:", error);
    return NextResponse.json(
      { message: "Erro interno ao processar a requisição." },
      { status: 500 }
    );
  }
}
