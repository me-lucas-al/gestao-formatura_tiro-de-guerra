"use client";

import { useState } from "react";
import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import DashboardHeader from "@/modules/dashboard/header";
import AtiradoresList from "@/modules/dashboard/atiradores-list";

export default function Dashboard() {
  const { data: atiradores, isLoading } = useGetAllAtiradores();
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  if (isLoading || !atiradores) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando dados dos atiradores...</p>
      </div>
    );
  }

  const handleRowClick = (atiradorId: number) => {
    setExpandedRowId(expandedRowId === atiradorId ? null : atiradorId);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <DashboardHeader />

      <AtiradoresList
        atiradores={atiradores}
        handleRowClick={handleRowClick}
        expandedRowId={expandedRowId}
      />
    </div>
  );
}
