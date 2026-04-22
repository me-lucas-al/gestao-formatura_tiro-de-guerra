import { expect, test, type Page } from "@playwright/test";
import jwt from "jsonwebtoken";

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

async function loginAsSuperAdmin(page: Page) {
  await authAs(page, { id: 99, name: "chefe", role: "SUPER_ADMIN", year: 2025 });
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Super Admin — fluxos de permissao e multi-tenancy", () => {
  test("troca de turma no YearSelector atualiza escopo ativo", async ({ page }) => {
    await loginAsSuperAdmin(page);

    const yearSelector = page.getByRole("combobox").first();
    await expect(yearSelector).toBeVisible();
    await yearSelector.click();

    const yearOptions = page.getByRole("option");
    const totalYears = await yearOptions.count();
    test.skip(totalYears < 2, "Ambiente de teste precisa de pelo menos duas turmas.");

    const currentYear = (await yearSelector.textContent())?.trim() ?? "";
    const firstAlternativeYear =
      ((await yearOptions.nth(0).textContent())?.trim() ?? "") === currentYear
        ? yearOptions.nth(1)
        : yearOptions.nth(0);
    const selectedYear = ((await firstAlternativeYear.textContent()) ?? "").trim();

    await firstAlternativeYear.click();
    await expect(yearSelector).toContainText(selectedYear);

    await page.goto("/dashboard/atiradores");
    await expect(page).toHaveURL(/\/dashboard\/atiradores/);
    await expect(yearSelector).toContainText(selectedYear);
  });

  test("remove admin comum com sucesso", async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto("/dashboard/admins");

    const adminName = `admin_e2e_${Date.now()}`;
    await page.getByLabel(/usuário/i).fill(adminName);
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /administrador padrão/i }).click();
    await page.getByRole("button", { name: /cadastrar/i }).click();
    await expect(page.getByText(/criado com sucesso/i)).toBeVisible({ timeout: 8000 });

    const targetRow = page.locator("div", { hasText: adminName }).first();
    await expect(targetRow).toBeVisible();
    await targetRow.getByRole("button", { name: /remover/i }).click();

    const confirmDialog = page.getByRole("alertdialog");
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole("button", { name: /^remover$/i }).click();

    await expect(page.getByText(/administrador removido com sucesso/i)).toBeVisible({
      timeout: 8000,
    });
  });

  test("edita atirador de turma selecionada e persiste na tabela", async ({ page }) => {
    await loginAsSuperAdmin(page);

    const yearSelector = page.getByRole("combobox").first();
    if (await yearSelector.isVisible()) {
      await yearSelector.click();
      const yearOptions = page.getByRole("option");
      if ((await yearOptions.count()) > 0) {
        await yearOptions.first().click();
      }
    }

    await page.goto("/dashboard/atiradores");
    const firstAtiradorRow = page.locator("tbody tr").first();
    await expect(firstAtiradorRow).toBeVisible();

    const atiradorNameCell = firstAtiradorRow.locator("td").nth(2).locator("span").first();
    const originalName = ((await atiradorNameCell.textContent()) ?? "").trim();
    test.skip(!originalName, "Nenhum atirador disponível para edição.");

    await firstAtiradorRow.getByRole("button").nth(1).click();
    const editDialog = page.getByRole("dialog", { name: /editar atirador/i });
    await expect(editDialog).toBeVisible();

    const updatedName = `${originalName} E2E`;
    await editDialog.getByLabel(/nome/i).fill(updatedName);
    await editDialog.getByRole("button", { name: /^salvar$/i }).click();

    await expect(page.getByText(/atirador atualizado com sucesso/i)).toBeVisible({
      timeout: 8000,
    });
    await expect(page.getByText(updatedName).first()).toBeVisible();
  });
});
