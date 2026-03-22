import { expect, test } from "@playwright/test";
import { authenticateAsAdmin } from "./helpers/session";

test("auth: login com credenciais inválidas", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Usuário / RA").fill("usuario_invalido");
  await page.getByLabel("Senha de Acesso").fill("senha_errada");
  await page.getByRole("button", { name: "AUTENTICAR" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText("Painel de Controle")).toHaveCount(0);
});

test("auth: sessão autenticada acessa dashboard", async ({ page }) => {
  await authenticateAsAdmin(page);
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Painel de Controle")).toBeVisible();
});
