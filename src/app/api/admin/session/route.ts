import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json(
      { message: 'Token não encontrado. Acesso não autorizado.' },
      { status: 401 }
    )
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)
    const { payload } = await jwtVerify(token, secret)
    const adminId = payload.id ? Number(payload.id) : undefined

    if (!adminId) {
      return NextResponse.json(
        { message: 'Token inválido. ID do administrador não encontrado.' },
        { status: 401 },
      )
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    })

    if (!admin) {
      return NextResponse.json(
        { message: 'Administrador não encontrado.' },
        { status: 404 },
      )
    }

    const { password, ...adminData } = admin
    return NextResponse.json(adminData)
  } catch (error) {
    console.error('Erro de verificação da sessão:', error)
    return NextResponse.json(
      { message: 'Sessão inválida ou expirada.' },
      { status: 401 },
    )
  }
}