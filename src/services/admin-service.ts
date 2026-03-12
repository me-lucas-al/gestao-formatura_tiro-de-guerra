import { AdminEntity, CreateAdminInput } from "@/schemas/admin";
import bcrypt from "bcrypt";

// Mock Database
let adminsMockDb: AdminEntity[] = [
  {
    id: 1,
    name: "Administrador Chefe",
    email: "admin@tg02009.eb.mil.br",
    role: "SUPER_ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let nextId = 2;

export const AdminService = {
  /**
   * Mock method to simulate finding an admin by email
   */
  async findByEmail(email: string): Promise<AdminEntity | null> {
    const admin = adminsMockDb.find((a) => a.email === email);
    return admin || null;
  },

  /**
   * Mock method to simulate saving an admin in the database
   */
  async createAdmin(input: CreateAdminInput, passwordHash: string): Promise<AdminEntity> {
    // In a real application, we would use Prisma here:
    // return prisma.admin.create({ data: { ...input, password: passwordHash } })
    
    const newAdmin: AdminEntity = {
      id: nextId++,
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      // We don't return the password hash to the client for security
    };

    adminsMockDb.push(newAdmin);
    return newAdmin;
  },

  /**
   * Mock method to simulate retrieving all admins
   */
  async getAdmins(): Promise<AdminEntity[]> {
    return [...adminsMockDb].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
};
