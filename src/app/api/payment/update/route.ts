import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { updatePaymentSchema } from '@/schemas/payment/create-payment-schema';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = parseInt(params.id);

    if (isNaN(paymentId)) {
      return NextResponse.json(
        { message: 'ID de pagamento inválido.' },
        { status: 400 }
      );
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { message: `Pagamento com ID ${paymentId} não encontrado.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsedData = updatePaymentSchema.parse(body);

    const { atiradorId, familyMemberId } = parsedData;

    if (atiradorId !== undefined && familyMemberId !== undefined) {
      if (atiradorId && familyMemberId) {
        return NextResponse.json(
          { message: 'O pagamento não pode ser associado a um atirador e um familiar ao mesmo tempo.' },
          { status: 400 }
        );
      }
    }

    if (atiradorId !== undefined && atiradorId !== null) {
      const atiradorExists = await prisma.atirador.findUnique({ 
        where: { id: atiradorId } 
      });
      if (!atiradorExists) {
        return NextResponse.json(
          { message: `Atirador com ID ${atiradorId} não encontrado.` },
          { status: 404 }
        );
      }
    }

    if (familyMemberId !== undefined && familyMemberId !== null) {
      const familyMemberExists = await prisma.familyMember.findUnique({ 
        where: { id: familyMemberId } 
      });
      if (!familyMemberExists) {
        return NextResponse.json(
          { message: `Familiar com ID ${familyMemberId} não encontrado.` },
          { status: 404 }
        );
      }
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: parsedData,
    });

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos.', issues: error.format() },
        { status: 400 }
      );
    }

    console.error('Erro ao atualizar pagamento:', error);
    return NextResponse.json(
      { message: 'Erro interno ao processar a requisição.' },
      { status: 500 }
    );
  }
}


