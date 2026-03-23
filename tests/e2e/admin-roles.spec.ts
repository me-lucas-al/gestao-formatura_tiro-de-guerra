import { expect, test } from "@playwright/test";
import jwt from "jsonwebtoken";
import type { Page } from "@playwright/test";

const jwtSecret = process.env.JWT_SECRET ?? "dev-jwt-secret";

async function authAs(
  page: Page,
  opts: { id: number; name: string; role: "ADMIN" | "SUPER_ADMIN"; year?: number },
) {
  const token = jwt.sign(
    { id: opts.id, name: opts.name, role: opts.role, year: opts.year ?? 2025 },
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

test.describe("SuperAdmin — criação de administradores", () => {
  test("superadmin vê e usa o formulário de criação", async ({ page }) => {
    await authAs(page, { id: 99, name: "chefe", role: "SUPER_ADMIN" });
    await page.goto("/dashboard/admins");

    // The create form should be visible for superadmins
    await expect(
      page.getByRole("heading", { name: /cadastrar novo administrador/i }),
    ).toBeVisible();

    // Role selection field should be visible to superadmins
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("admin comum NÃO vê o formulário de criação", async ({ page }) => {
    await authAs(page, { id: 1, name: "soldado", role: "ADMIN" });
    await page.goto("/dashboard/admins");

    // The create form heading should NOT be visible for regular admins
    await expect(
      page.getByRole("heading", { name: /cadastrar novo administrador/i }),
    ).toHaveCount(0);
  });

  test("superadmin pode criar admin com role ADMIN", async ({ page }) => {
    await authAs(page, { id: 99, name: "chefe", role: "SUPER_ADMIN" });
    await page.goto("/dashboard/admins");

    const uniqueName = `Test${Date.now()}`;

    await page.getByLabel(/usuário/i).fill(uniqueName);

    // Select ADMIN role
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /administrador padrão/i }).click();

    await page.getByRole("button", { name: /cadastrar/i }).click();

    await expect(page.getByText(/criado com sucesso/i)).toBeVisible({ timeout: 8000 });
  });

  test("superadmin pode criar admin com role SUPER_ADMIN (promover)", async ({ page }) => {
    await authAs(page, { id: 99, name: "chefe", role: "SUPER_ADMIN" });
    await page.goto("/dashboard/admins");

    const uniqueName = `SuperTest${Date.now()}`;

    await page.getByLabel(/usuário/i).fill(uniqueName);

    // Select SUPER_ADMIN role
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /administrador chefe/i }).click();

    await page.getByRole("button", { name: /cadastrar/i }).click();

    await expect(page.getByText(/criado com sucesso/i)).toBeVisible({ timeout: 8000 });
  });
});
