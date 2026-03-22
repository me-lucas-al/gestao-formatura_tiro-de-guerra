import type { Page } from "@playwright/test";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET ?? "dev-jwt-secret";
const adminId = Number(process.env.E2E_ADMIN_ID ?? 1);
const adminName = process.env.E2E_ADMIN_NAME ?? "victor";
const adminRole = process.env.E2E_ADMIN_ROLE ?? "SUPER_ADMIN";
const adminYear = Number(process.env.E2E_ADMIN_YEAR ?? 2025);

export async function authenticateAsAdmin(page: Page) {
  const token = jwt.sign(
    {
      id: adminId,
      name: adminName,
      role: adminRole,
      year: adminYear,
    },
    jwtSecret,
    { expiresIn: "1d" },
  );

  await page.context().addCookies([
    {
      name: "token",
      value: token,
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}
