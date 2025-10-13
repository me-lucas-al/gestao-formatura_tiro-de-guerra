import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const atiradores = await prisma.atirador.findMany({
      orderBy: {
        number: 'asc',
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
    })
    return NextResponse.json(atiradores)
  } catch (error) {
    console.error('Erro ao buscar atiradores:', error)
    return NextResponse.json(
      { message: 'Erro interno ao buscar atiradores.' },
      { status: 500 },
    )
  }
}