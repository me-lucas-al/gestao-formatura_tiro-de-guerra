"use client";

import { createContext, useContext, useState } from "react";
import { AtiradorWithRelations } from "@packages/types";

interface FamilyMemberModalContextType {
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  selectedAtiradorId: number | null;
  selectedFamilyMember: AtiradorWithRelations["familyMembers"][number] | null;
  openCreateModal: (atiradorId: number) => void;
  openEditModal: (atiradorId: number, familyMember: AtiradorWithRelations["familyMembers"][number]) => void;
  closeModal: () => void;
}

const FamilyMemberModalContext = createContext<FamilyMemberModalContextType | null>(null);

export function FamilyMemberModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAtiradorId, setSelectedAtiradorId] = useState<number | null>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<AtiradorWithRelations["familyMembers"][number] | null>(null);

  const openCreateModal = (atiradorId: number) => {
    setSelectedAtiradorId(atiradorId);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (atiradorId: number, familyMember: AtiradorWithRelations["familyMembers"][number]) => {
    setSelectedAtiradorId(atiradorId);
    setSelectedFamilyMember(familyMember);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFamilyMember(null);
  };

  return (
    <FamilyMemberModalContext.Provider
      value={{
        isModalOpen,
        modalMode,
        selectedAtiradorId,
        selectedFamilyMember,
        openCreateModal,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </FamilyMemberModalContext.Provider>
  );
}

export function useFamilyMemberModal() {
  const context = useContext(FamilyMemberModalContext);
  if (!context) {
    throw new Error("useFamilyMemberModal must be used within FamilyMemberModalProvider");
  }
  return context;
}
