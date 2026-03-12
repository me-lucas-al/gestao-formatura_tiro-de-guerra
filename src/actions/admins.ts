"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { CreateAdminSchema } from "@/schemas/admin";
import { AdminService } from "@/services/admin-service";

export type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
};

export async function createAdmin(formData: FormData): Promise<ActionResponse> {
  // 1. Validate permissions (Simulating that only SUPER_ADMIN or ADMIN can create)
  // const session = await auth();
  // if (!session || session.user.role !== "SUPER_ADMIN") {
  //   return {
  //     success: false,
  //     error: "Acesso negado. Apenas administradores podem realizar esta ação.",
  //   };
  // }

  // 2. Extract Data
  const data = Object.fromEntries(formData.entries());

  // 3. Validation with Zod
  const validatedFields = CreateAdminSchema.safeParse({
    name: data.name,
    email: data.email,
    role: data.role,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Validação falhou. Verifique os campos.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, role } = validatedFields.data;

  try {
    // 4. Check if email already exists
    const existingAdmin = await AdminService.findByEmail(email);
    if (existingAdmin) {
      return {
        success: false,
        error: "Este e-mail já está em uso por outro administrador.",
      };
    }

    // 5. Default password rule
    const DEFAULT_PASSWORD = "admin123";
    const SALT_ROUNDS = 10;
    
    // 6. Hashing
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    // 7. Save to Mock Database
    const newAdmin = await AdminService.createAdmin(
      { name, email, role },
      passwordHash
    );

    // 8. Revalidate Path to refresh UI
    revalidatePath("/admins");

    return {
      success: true,
      message: "Administrador criado com sucesso! A senha padrão é 'admin123'.",
      data: newAdmin,
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    // Generic message to the frontend, real error in the server logs
    return {
      success: false,
      error: "Ocorreu um erro inesperado ao criar o administrador. Tente novamente mais tarde.",
    };
  }
}
