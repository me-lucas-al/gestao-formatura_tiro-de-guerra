import { expect, test } from "@playwright/test";
import { authenticateAsAdmin } from "./helpers/session";

async function login(page: import("@playwright/test").Page) {
  await authenticateAsAdmin(page);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
}

test("dashboard: carregar métricas", async ({ page }) => {
  await login(page);

  await expect(page.getByText("Total de Atiradores")).toBeVisible();
  await expect(page.getByText("Total de Familiares")).toBeVisible();
  await expect(page.getByText("Total Arrecadado")).toBeVisible();
});

test("admin: abrir modulo e visualizar formulario", async ({ page }) => {
  await login(page);
  await page.goto("/dashboard/admins");

  await expect(page.getByText("Gestao de Administradores")).toBeVisible();
  await expect(page.getByLabel("Usuário")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cadastrar" })).toBeVisible();
});

test("atirador: abrir e fechar modal de status", async ({ page }) => {
  await login(page);

  const firstAtiradorRow = page.locator("tbody tr").first();
  await expect(firstAtiradorRow).toBeVisible();

  await firstAtiradorRow.getByRole("button", { name: "Status" }).click();

  const statusDialog = page.getByRole("dialog", {
    name: "Mudar Status do Pagamento",
  });
  await expect(statusDialog).toBeVisible();
  await statusDialog.getByRole("button", { name: "Cancelar" }).click();
  await expect(statusDialog).toHaveCount(0);
});

test("family-member: abrir painel de familiares", async ({ page }) => {
  await login(page);

  const firstAtiradorRow = page.locator("tbody tr").first();
  await expect(firstAtiradorRow).toBeVisible();
  await firstAtiradorRow.click();

  await expect(page.getByText(/Familiares de/i).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Adicionar" }).first(),
  ).toBeVisible();
});

test("payment: abrir modal de status", async ({ page }) => {
  await login(page);

  const firstAtiradorRow = page.locator("tbody tr").first();
  await expect(firstAtiradorRow).toBeVisible();
  await firstAtiradorRow.click();
  await firstAtiradorRow.getByRole("button", { name: "Status" }).click();

  const statusDialog = page.getByRole("dialog", {
    name: "Mudar Status do Pagamento",
  });
  await expect(statusDialog).toBeVisible();
  await statusDialog.getByRole("button", { name: "Cancelar" }).click();
  await expect(statusDialog).toHaveCount(0);
});
