
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateFamilyMemberSchema } from '@/schemas/family-members/family-member-schema';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const familyMemberId = parseInt(params.id, 10);

    if (isNaN(familyMemberId)) {
      return NextResponse.json({ message: 'ID inválido.' }, { status: 400 });
    }

    console.log('ID do familiar a ser atualizado:', familyMemberId, " com o tipo ", typeof familyMemberId);

    const body = await request.json();
    const parsed = updateFamilyMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Dados inválidos.", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, age, payment } = parsed.data;

  
    const familyMemberExists = await prisma.familyMember.findUnique({
      where: { id: familyMemberId },
    });

    if (!familyMemberExists) {
      return NextResponse.json(
        { message: `Familiar com ID ${familyMemberId} não encontrado.` },
        { status: 404 }
      );
    }

    const updatedFamilyMember = await prisma.familyMember.update({
      where: {
        id: familyMemberId,
      },
      data: {
        name,
        age,
        payment: payment
          ? {
              update: {
                status: payment.status,
                value: payment.value,
                method: payment.method,
              },
            }
          : undefined,
      },
      include: {
        payment: true,
        atirador: true,
      },
    });

    return NextResponse.json(updatedFamilyMember, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar familiar:', error);
    return NextResponse.json(
      { message: 'Erro interno ao processar a requisição.' },
      { status: 500 }
    );
  }
}