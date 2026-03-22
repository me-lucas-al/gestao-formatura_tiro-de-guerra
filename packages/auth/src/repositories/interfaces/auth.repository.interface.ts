import type {
  AuthAdminCredentials,
  AuthAdminSession,
} from "../../dto/auth-admin.schema";

export interface IAuthRepository {
  findByName(name: string): Promise<AuthAdminCredentials | null>;
  findById(id: number): Promise<AuthAdminSession | null>;
  readSessionToken(): Promise<string | null>;
  writeSessionToken(token: string): Promise<void>;
  clearSessionToken(): Promise<void>;
}
