import DashboardHeader from "@/modules/dashboard/header";
import AtiradoresList from "@/modules/atiradores/list";
import { DashboardProvider } from "@/contexts/dashboard-context";
import FamilyMembersList from "@/modules/family-member/list";
import { getAtiradores, getTotalArrecadado } from "@/actions/atiradores";
import { getFamilyMembers } from "@/actions/family-members";
import { DashboardSectionTabs } from "@/modules/dashboard/section-tabs";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const atiradorFilters = {
    name: (params.atirador_name as string) || "",
    number: (params.atirador_number as string) || "",
    status: (params.atirador_status as string) || "ALL",
  };

  const familyFilters = {
    name: (params.family_name as string) || "",
    status: (params.family_status as string) || "ALL",
  };

  const [atiradoresRes, familyMembersRes, totalArrecadadoRes] = await Promise.all([
    getAtiradores(atiradorFilters),
    getFamilyMembers(familyFilters),
    getTotalArrecadado(),
  ]);

  const atiradores = atiradoresRes.success ? atiradoresRes.data || [] : [];
  const familyMembers = familyMembersRes.success ? familyMembersRes.data || [] : [];
  const totalArrecadado = totalArrecadadoRes.success ? (totalArrecadadoRes.data as number) || 0 : 0;

  return (
    <DashboardProvider>
      <div className="container mx-auto p-4 md:p-8">
        <DashboardHeader
          atiradores={atiradores}
          familyMembers={familyMembers}
          totalArrecadado={totalArrecadado}
        />
        <DashboardSectionTabs />
        <AtiradoresList atiradores={atiradores} filters={atiradorFilters} />
        <FamilyMembersList familyMembers={familyMembers} filters={familyFilters} />
      </div>
    </DashboardProvider>
  );
}
