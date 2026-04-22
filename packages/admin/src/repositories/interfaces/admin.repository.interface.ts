import type {
  AdminEntity,
  CreateAdminWithPasswordInput,
} from "../../dto/admin.schema";

export interface IAdminRepository {
  findByName(name: string): Promise<AdminEntity | null>;
  create(input: CreateAdminWithPasswordInput): Promise<AdminEntity>;
  deleteById(id: number): Promise<void>;
  updatePassword(id: number, passwordHash: string): Promise<void>;
  findMany(year?: number): Promise<AdminEntity[]>;
}
