"use server";

import bcrypt from "bcrypt";
import { jwtVerify } from "jose";
import jwt from "jsonwebtoken";
import { AuthErrorSchema } from "../dto/auth-result.schema";
import { SessionTokenPayloadSchema } from "../dto/session.schema";
import { SignInSchema } from "../dto/sign-in.schema";
import { authRepository } from "../repositories/actions/auth.repository.actions";
import { AuthService } from "../services/auth.service";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }

  return secret;
};

const createAuthService = () =>
  new AuthService(
    authRepository,
    bcrypt.compare,
    async (payload) =>
      jwt.sign(payload, getJwtSecret(), {
        expiresIn: "1d",
      }),
    async (token) => {
      const encodedSecret = new TextEncoder().encode(getJwtSecret());
      const verified = await jwtVerify(token, encodedSecret);

      return SessionTokenPayloadSchema.parse({
        id: Number(verified.payload.id),
        name: verified.payload.name,
        role: verified.payload.role,
        year: Number(verified.payload.year),
      });
    },
  );

export const loginController = async (input: unknown) => {
  const parsedInput = SignInSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstIssue = parsedInput.error.issues.at(0);

    return AuthErrorSchema.parse({
      success: false,
      error: firstIssue?.message ?? "Credenciais inválidas.",
    });
  }

  const service = createAuthService();

  return service.login(parsedInput.data);
};

export const getSessionController = async () => {
  const service = createAuthService();

  return service.getSession();
};

export const logoutController = async () => {
  const service = createAuthService();

  return service.logout();
};
