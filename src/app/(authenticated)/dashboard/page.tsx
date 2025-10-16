"use client";

import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import DashboardHeader from "@/modules/dashboard/header";
import AtiradoresList from "@/modules/atiradores/list";
import { DashboardProvider } from "@/contexts/dashboard-context";
import FamilyMemberModalWrapper from "@/modules/family-member/wrapper";
import { FamilyMemberModalProvider } from "@/contexts/family-member-modal-context";
import FamilyMembersList from "@/modules/family-member/list";

export default function Dashboard() {
  const { data: atiradores, isLoading } = useGetAllAtiradores();

  if (isLoading || !atiradores) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando dados dos atiradores...</p>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <FamilyMemberModalProvider>
        <div className="container mx-auto p-4 md:p-8">
          <DashboardHeader />
          <AtiradoresList />
          <FamilyMembersList />
          <FamilyMemberModalWrapper />
        </div>
      </FamilyMemberModalProvider>
    </DashboardProvider>
  );
}