import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createPaymentSchema } from '@/schemas/payment/create-payment-schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = createPaymentSchema.parse(body);

    const { atiradorId, familyMemberId } = parsedData;

    // 1. Validação para garantir que o pagamento está associado a alguém
    if (!atiradorId && !familyMemberId) {
      return NextResponse.json(
        { message: 'O pagamento deve ser associado a um atirador ou a um familiar.' },
        { status: 400 }
      );
    }

    if (atiradorId && familyMemberId) {
      return NextResponse.json(
        { message: 'O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.' },
        { status: 400 }
      );
    }

    // 2. Verifica se a entidade associada existe
    if (atiradorId) {
      const atiradorExists = await prisma.atirador.findUnique({ where: { id: atiradorId } });
      if (!atiradorExists) {
        return NextResponse.json({ message: `Atirador com ID ${atiradorId} não encontrado.` }, { status: 404 });
      }
    }

    if (familyMemberId) {
      const familyMemberExists = await prisma.familyMember.findUnique({ where: { id: familyMemberId } });
      if (!familyMemberExists) {
        return NextResponse.json({ message: `Familiar com ID ${familyMemberId} não encontrado.` }, { status: 404 });
      }
    }

    // 3. Cria o pagamento no banco de dados
    const newPayment = await prisma.payment.create({
      data: {
        ...parsedData,
        id: undefined, // Garante que o ID seja gerado pelo banco
      },
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos.', issues: error.format() },
        { status: 400 }
      );
    }

    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json(
      { message: 'Erro interno ao processar a requisição.' },
      { status: 500 }
    );
  }
}