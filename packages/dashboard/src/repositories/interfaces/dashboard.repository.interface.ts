import type {
  DashboardAtirador,
  DashboardFamilyMember,
} from "../../dto/dashboard.schema";

export type DashboardAtiradorFilters = {
  year: number;
  name?: string;
  number?: number;
  status?: string;
};

export type DashboardFamilyMemberFilters = {
  year: number;
  name?: string;
  status?: string;
};

export interface IDashboardRepository {
  getAtiradores(
    filters: DashboardAtiradorFilters,
  ): Promise<DashboardAtirador[]>;
  getFamilyMembers(
    filters: DashboardFamilyMemberFilters,
  ): Promise<DashboardFamilyMember[]>;
  getTotalArrecadado(year: number): Promise<number>;
}
