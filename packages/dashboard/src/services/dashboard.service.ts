import type { DashboardResult } from "../dto/dashboard-result.schema";
import { DashboardErrorSchema } from "../dto/dashboard-result.schema";
import { DashboardInputSchema } from "../dto/dashboard.schema";
import type { IDashboardRepository } from "../repositories/interfaces/dashboard.repository.interface";

export class DashboardService {
  constructor(private readonly dashboardRepository: IDashboardRepository) {}

  async getDashboard(
    rawInput: unknown,
    year: number,
  ): Promise<DashboardResult> {
    const parsedInput = DashboardInputSchema.safeParse(rawInput ?? {});

    if (!parsedInput.success) {
      return DashboardErrorSchema.parse({
        success: false,
        error: "Filtros inválidos.",
      });
    }

    const atiradorNumber = parsedInput.data.atirador_number
      ? Number(parsedInput.data.atirador_number)
      : undefined;

    const [atiradores, familyMembers, totalArrecadado] = await Promise.all([
      this.dashboardRepository.getAtiradores({
        year,
        name: parsedInput.data.atirador_name || undefined,
        number:
          atiradorNumber !== undefined && Number.isFinite(atiradorNumber)
            ? atiradorNumber
            : undefined,
        status: parsedInput.data.atirador_status || "ALL",
      }),
      this.dashboardRepository.getFamilyMembers({
        year,
        name: parsedInput.data.family_name || undefined,
        status: parsedInput.data.family_status || "ALL",
      }),
      this.dashboardRepository.getTotalArrecadado(year),
    ]);

    return {
      success: true,
      data: {
        atiradores,
        familyMembers,
        totalArrecadado,
      },
    };
  }
}
