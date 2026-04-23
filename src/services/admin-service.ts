import { db } from "@/lib/prisma";
import type { CreateAdminInput, AdminEntity } from "@/schemas/admin";
import { Prisma } from "@prisma/client";

export const AdminService = {
  async alignAdminIdSequence() {
    await db.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"Admin"', 'id'),
        COALESCE((SELECT MAX(id) FROM "Admin"), 1),
        true
      );
    `);
  },

  async findByName(name: string): Promise<AdminEntity | null> {
    return db.admin.findFirst({
      where: { name },
      omit: { password: true },
    });
  },

  async createAdmin(
    input: CreateAdminInput,
    passwordHash: string,

  ): Promise<AdminEntity> {
    const createData = {
      name: input.name.toUpperCase(),
      role: input.role,
      year: input.year,
      password: passwordHash,
    };

    try {
      return await db.admin.create({
        data: createData,
        omit: { password: true },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      if (error.code !== "P2002") {
        throw error;
      }

      const target = String((error.meta as { target?: unknown })?.target ?? "");
      const isIdError = target.includes("id") || error.message.includes("`id`") || error.message.includes("'id'");
      if (!isIdError) {
        throw error;
      }

      await this.alignAdminIdSequence();

      return db.admin.create({
        data: createData,
        omit: { password: true },
      });
    }
  },

  async deleteAdmin(id: number): Promise<void> {
    await db.admin.delete({ where: { id } });
  },

  async changePassword(id: number, passwordHash: string): Promise<void> {
    await db.admin.update({
      where: { id },
      data: { password: passwordHash },
    });
  },

  async getAdmins(): Promise<AdminEntity[]> {
    return db.admin.findMany({
      omit: { password: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
