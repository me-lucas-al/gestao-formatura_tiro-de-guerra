"use server";

import { DashboardActorSchema } from "../dto/dashboard.schema";
import { DashboardErrorSchema } from "../dto/dashboard-result.schema";
import { dashboardRepository } from "../repositories/actions/dashboard.repository.actions";
import { DashboardService } from "../services/dashboard.service";

const createDashboardService = () => new DashboardService(dashboardRepository);

export const getDashboardController = async (
  filtersInput: unknown,
  actorInput: unknown,
) => {
  const parsedActor = DashboardActorSchema.safeParse(actorInput);

  if (!parsedActor.success) {
    return DashboardErrorSchema.parse({
      success: false,
      error: "Acesso negado. Autenticação necessária.",
    });
  }

  const service = createDashboardService();

  return service.getDashboard(filtersInput, parsedActor.data.year);
};
