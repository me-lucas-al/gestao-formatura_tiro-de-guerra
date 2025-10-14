// src/app/api/familyMembers/[id]/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { updateFamilyMemberSchema } from '@/schemas/family-members/update-family-members-schema';
import { Prisma } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const familyMemberId = parseInt(params.id, 10);
    if (isNaN(familyMemberId)) {
      return NextResponse.json({ message: 'ID inválido.' }, { status: 400 });
    }

    const body = await request.json();
    const parsedData = updateFamilyMemberSchema.parse(body);

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
        name: parsedData.name,
        age: parsedData.age,
        payment: parsedData.payment
          ? {
              update: {
                status: parsedData.payment.status,
                value: parsedData.payment.value,
                method: parsedData.payment.method,
              },
            }
          : undefined,
      },
      include: {
        payment: true,
      },
    });

    return NextResponse.json(updatedFamilyMember, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos.', issues: error.format() },
        { status: 400 }
      );
    }

    console.error('Erro ao atualizar familiar:', error);
    return NextResponse.json(
      { message: 'Erro interno ao processar a requisição.' },
      { status: 500 }
    );
  }
}