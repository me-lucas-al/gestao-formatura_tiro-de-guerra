// src/app/api/admins/route.ts
import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      include: {
        atiradores: {
          include: {
            payment: true, 
          },
        },
      },
    })
    return NextResponse.json(admins)
  } catch (error) {
    console.error('Erro ao buscar administradores:', error)
    return NextResponse.json(
      { message: 'Erro interno ao buscar administradores.' },
      { status: 500 },
    )
  }
}