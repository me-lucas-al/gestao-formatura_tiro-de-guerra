import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);

    const adminId = typeof payload.id === 'number' ? payload.id : parseInt(payload.id as string, 10);

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: {
        atiradores: {
          include: {
            payment: true,
          },
        },
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrador não encontrado" }, { status: 404 });
    }

    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json(adminWithoutPassword);
  } catch (err) {
    console.error("Erro de autenticação:", err);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}