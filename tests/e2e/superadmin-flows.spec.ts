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

async function openYearSelector(page: Page) {
  const yearSelector = page.getByRole("combobox").first();
  await expect(yearSelector).toBeVisible();
  await yearSelector.click();
  return yearSelector;
}

async function getAvailableYearValues(page: Page) {
  const yearOptions = page.getByRole("option");
  const totalOptions = await yearOptions.count();
  const years: number[] = [];

  for (let index = 0; index < totalOptions; index += 1) {
    const label = ((await yearOptions.nth(index).textContent()) ?? "").trim();
    const parsedYear = Number(label);

    if (!Number.isNaN(parsedYear)) {
      years.push(parsedYear);
    }
  }

  return years;
}

async function selectYear(page: Page, year: number) {
  const yearSelector = await openYearSelector(page);
  await page.getByRole("option", { name: String(year), exact: true }).click();
  await expect(yearSelector).toContainText(String(year));
}

test.describe("Super Admin — fluxos de permissao e multi-tenancy", () => {
  test("YearSelector lista anos de admins e atiradores", async ({ page }) => {
    await loginAsSuperAdmin(page);

    await openYearSelector(page);
    const years = await getAvailableYearValues(page);
    test.skip(years.length < 2, "Ambiente de teste precisa de pelo menos duas turmas.");

    const yearOptions = page.getByRole("option");
    await yearOptions.first().click();

    const has2025 = years.includes(2025);
    const has2026 = years.includes(2026);

    if (has2025) {
      await openYearSelector(page);
      await expect(page.getByRole("option", { name: "2025", exact: true })).toBeVisible();
      await page.getByRole("option").first().click();
    }

    if (has2026) {
      await openYearSelector(page);
      await expect(page.getByRole("option", { name: "2026", exact: true })).toBeVisible();
      await page.getByRole("option").first().click();
    }
  });

  test("troca de turma no YearSelector atualiza escopo ativo", async ({ page }) => {
    await loginAsSuperAdmin(page);
    const yearSelector = await openYearSelector(page);
    const years = await getAvailableYearValues(page);
    test.skip(years.length < 2, "Ambiente de teste precisa de pelo menos duas turmas.");
    const currentYear = Number(((await yearSelector.textContent()) ?? "").trim());
    const selectedYear = years.find((year) => year !== currentYear);
    test.skip(!selectedYear, "Nao foi possivel identificar um ano alternativo.");
    await page.getByRole("option", { name: String(selectedYear), exact: true }).click();
    await expect(yearSelector).toContainText(String(selectedYear));

    await page.goto("/dashboard/atiradores");
    await expect(page).toHaveURL(/\/dashboard\/atiradores/);
    await expect(yearSelector).toContainText(String(selectedYear));
  });

  test("cria atirador no ano selecionado pelo superadmin", async ({ page }) => {
    await loginAsSuperAdmin(page);
    await openYearSelector(page);
    const years = await getAvailableYearValues(page);
    test.skip(years.length < 2, "Ambiente de teste precisa de pelo menos duas turmas.");

    const preferredYear = years.includes(2026) ? 2026 : years[0];
    await page.getByRole("option", { name: String(preferredYear), exact: true }).click();
    await expect(page.getByRole("combobox").first()).toContainText(String(preferredYear));

    const uniqueSuffix = Date.now();
    const atiradorName = `Atirador E2E ${preferredYear} ${uniqueSuffix}`;
    const atiradorNumber = String(900 + (uniqueSuffix % 90));

    await page.getByRole("button", { name: /adicionar atirador/i }).click();
    const createDialog = page.getByRole("dialog", { name: /adicionar atirador/i });
    await expect(createDialog).toBeVisible();
    await createDialog.getByLabel(/numero/i).fill(atiradorNumber);
    await createDialog.getByLabel(/nome/i).fill(atiradorName);
    await createDialog.getByRole("button", { name: /^salvar$/i }).click();

    await expect(page.getByText(/atirador adicionado com sucesso/i)).toBeVisible({
      timeout: 8000,
    });
    await expect(page.getByText(atiradorName)).toBeVisible();
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

    const years = await (async () => {
      await openYearSelector(page);
      return getAvailableYearValues(page);
    })();
    if (years.length > 0) {
      await selectYear(page, years[0]);
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
