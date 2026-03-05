"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function loginAdmin({ adminName, password }: any) {
  try {
    const admin = await db.admin.findFirst({ where: { name: adminName } });

    if (!admin) {
      return { error: "Usuário não encontrado" };
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return { error: "Senha incorreta" };
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return { success: true, message: "Login realizado com sucesso" };
  } catch (error) {
    console.error("Erro no login:", error);
    return { error: "Erro interno no servidor" };
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        error: "Token não encontrado. Acesso não autorizado.",
        status: 401,
      };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload } = await jwtVerify(token, secret);
    const adminId = payload.id ? Number(payload.id) : undefined;

    if (!adminId) {
      return {
        error: "Token inválido. ID do administrador não encontrado.",
        status: 401,
      };
    }

    const admin = await db.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      return { error: "Administrador não encontrado.", status: 404 };
    }

    const { password, ...adminData } = admin;
    return { success: true, data: adminData };
  } catch (error) {
    console.error("Erro de verificação da sessão:", error);
    return { error: "Sessão inválida ou expirada.", status: 401 };
  }
}

export async function getAllAdmins() {
  try {
    const admins = await db.admin.findMany({
      include: {
        atiradores: {
          include: {
            payment: true,
          },
        },
      },
    });
    return { success: true, data: admins };
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    return { error: "Erro interno ao buscar administradores." };
  }
}
