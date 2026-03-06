import DashboardHeader from "@/modules/dashboard/header";
import AtiradoresList from "@/modules/atiradores/list";
import { DashboardProvider } from "@/contexts/dashboard-context";
import FamilyMemberModalWrapper from "@/modules/family-member/wrapper";
import { FamilyMemberModalProvider } from "@/contexts/family-member-modal-context";
import AtiradorModalWrapper from "@/modules/atiradores/wrapper";
import { AtiradorModalProvider } from "@/contexts/atirador-modal-context";
import FamilyMembersList from "@/modules/family-member/list";
import { getAtiradores } from "@/actions/atiradores";
import { getFamilyMembers } from "@/actions/family-members";

export default async function Dashboard() {
  const atiradoresRes = await getAtiradores();
  const familyMembersRes = await getFamilyMembers();

  const atiradores = atiradoresRes.success ? atiradoresRes.data : [];
  const familyMembers = familyMembersRes.success ? familyMembersRes.data : [];

  return (
    <DashboardProvider>
      <AtiradorModalProvider>
        <FamilyMemberModalProvider>
          <div className="container mx-auto p-4 md:p-8">
            <DashboardHeader atiradores={atiradores} familyMembers={familyMembers} />
            <AtiradoresList atiradores={atiradores} />
            <FamilyMembersList familyMembers={familyMembers} />
            <FamilyMemberModalWrapper />
            <AtiradorModalWrapper />
          </div>
        </FamilyMemberModalProvider>
      </AtiradorModalProvider>
    </DashboardProvider>
  );
}