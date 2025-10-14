import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const familyMembers = await prisma.familyMember.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        payment: true,
        atirador: true,
      },
    });
    return NextResponse.json(familyMembers);
  } catch (error) {
    console.error('Erro ao buscar familiares:', error);
    return NextResponse.json(
      { message: 'Erro interno ao buscar familiares.' },
      { status: 500 }
    );
  }
}