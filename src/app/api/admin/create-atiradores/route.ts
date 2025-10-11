// src/app/api/admin/add-atiradores/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'
import  prisma  from '@/lib/prisma'

const addAtiradorSchema = z.object({
  number: z.coerce.number().min(1).max(100),
  name: z.string().min(3),
  familyMemberQuantity: z.coerce.number().min(0),
  adminId: z.coerce.number().positive(),
  // Campos de pagamento adicionados
  paymentValue: z.coerce.number().positive('O valor do pagamento deve ser positivo.'),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedData = addAtiradorSchema.parse(body)

    const atiradorExists = await prisma.atirador.findFirst({
      where: { number: parsedData.number },
    })

    if (atiradorExists) {
      return NextResponse.json(
        { message: `O atirador com o número ${parsedData.number} já existe.` },
        { status: 409 },
      )
    }

    const newAtirador = await prisma.$transaction(async (tx: any) => {
      const atirador = await tx.atirador.create({
        data: {
          number: parsedData.number,
          name: parsedData.name,
          familyMemberQuantity: parsedData.familyMemberQuantity,
          adminId: parsedData.adminId,
        },
      })

      await tx.payment.create({
        data: {
          value: parsedData.paymentValue,
          method: parsedData.paymentMethod,
          atiradorId: atirador.id,
          // O status por defeito é PENDING
        },
      })

      return atirador
    })

    return NextResponse.json(newAtirador, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos.', issues: error.format() },
        { status: 400 },
      )
    }
    console.error('Erro ao criar atirador:', error)
    return NextResponse.json(
      { message: 'Erro interno ao processar a requisição.' },
      { status: 500 },
    )
  }
}