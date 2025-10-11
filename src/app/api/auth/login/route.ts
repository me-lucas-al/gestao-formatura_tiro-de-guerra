import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { adminName, password } = await req.json();
  const admin = await prisma.admin.findFirst({ where: { name: adminName } });

  if (!admin)
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid)
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

  const token = jwt.sign({ id: admin.id, name: admin.name }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({ message: "Login realizado com sucesso" });
  response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
  return response;
}
