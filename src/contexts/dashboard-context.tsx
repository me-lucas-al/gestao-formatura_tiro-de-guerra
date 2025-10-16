// src/contexts/dashboard-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DashboardContextType = {
  expandedRowId: number | null;
  setExpandedRowId: (id: number | null) => void;
  toggleRow: (id: number) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <DashboardContext.Provider value={{ expandedRowId, setExpandedRowId, toggleRow }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}