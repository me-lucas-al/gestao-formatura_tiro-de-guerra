import type {
  LoginResult,
  LogoutResult,
  SessionResult,
} from "../dto/auth-result.schema";
import { SessionTokenPayloadSchema } from "../dto/session.schema";
import type { SignInInput } from "../dto/sign-in.schema";
import type { IAuthRepository } from "../repositories/interfaces/auth.repository.interface";

type ComparePassword = (
  plainTextPassword: string,
  hashedPassword: string,
) => Promise<boolean>;

type SignToken = (payload: {
  id: number;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  year: number;
}) => Promise<string>;

type VerifyToken = (token: string) => Promise<{
  id: number;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
  year: number;
}>;

export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly comparePassword: ComparePassword,
    private readonly signToken: SignToken,
    private readonly verifyToken: VerifyToken,
  ) {}

  async login(input: SignInInput): Promise<LoginResult> {
    const admin = await this.authRepository.findByName(input.adminName);

    if (!admin) {
      return { success: false, error: "Usuário não encontrado" };
    }

    const isPasswordValid = await this.comparePassword(
      input.password,
      admin.password,
    );

    if (!isPasswordValid) {
      return { success: false, error: "Senha incorreta" };
    }

    const tokenPayload = SessionTokenPayloadSchema.parse({
      id: admin.id,
      name: admin.name,
      role: admin.role,
      year: admin.year,
    });

    const token = await this.signToken(tokenPayload);
    await this.authRepository.writeSessionToken(token);

    return { success: true, message: "Login realizado com sucesso" };
  }

  async getSession(): Promise<SessionResult> {
    const token = await this.authRepository.readSessionToken();

    if (!token) {
      return {
        success: false,
        error: "Token não encontrado. Acesso não autorizado.",
        status: 401,
      };
    }

    try {
      const tokenPayload = await this.verifyToken(token);
      const validPayload = SessionTokenPayloadSchema.parse(tokenPayload);
      const admin = await this.authRepository.findById(validPayload.id);

      if (!admin) {
        return {
          success: false,
          error: "Administrador não encontrado.",
          status: 404,
        };
      }

      return { success: true, data: admin };
    } catch {
      return {
        success: false,
        error: "Sessão inválida ou expirada.",
        status: 401,
      };
    }
  }

  async logout(): Promise<LogoutResult> {
    await this.authRepository.clearSessionToken();

    return { success: true, message: "Logout realizado com sucesso" };
  }
}
