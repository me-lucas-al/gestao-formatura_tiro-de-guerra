import { db } from "@/lib/prisma";
import type { CreateAdminInput, AdminEntity } from "@/schemas/admin";

export const AdminService = {
  async findByEmail(email: string): Promise<AdminEntity | null> {
    return db.admin.findUnique({
      where: { email },
      omit: { password: true },
    });
  },

  async findByName(name: string): Promise<AdminEntity | null> {
    return db.admin.findUnique({
      where: { name },
      omit: { password: true },
    });
  },

  async createAdmin(
    input: CreateAdminInput,
    passwordHash: string,
  ): Promise<AdminEntity> {
    return db.admin.create({
      data: {
        name: input.name,
        role: input.role,
        year: input.year,
        password: passwordHash,
      },
      omit: { password: true },
    });
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
