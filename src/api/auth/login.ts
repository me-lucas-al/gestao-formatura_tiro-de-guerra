
import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../../lib/prisma"; 

export default async function authRoutes(app: FastifyInstance) {

  app.post("/login", async (request, reply) => {
    const { adminName, password } = request.body as {
      adminName: string;
      password: string;
    };

    const admin = await prisma.admin.findUnique({ where: { adminName } });
    if (!admin) {
      return reply.code(401).send({ error: "Usuário não encontrado" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return reply.code(401).send({ error: "Senha incorreta" });
    }

    const token = app.jwt.sign(
      { id: admin.id, adminName: admin.adminName },
    );

    return { token };
  });
}
