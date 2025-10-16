import { createContext, useContext, useState } from "react";

interface FamilyMemberModalContextType {
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  selectedAtiradorId: number | null;
  selectedFamilyMember: any;
  openCreateModal: (atiradorId: number) => void;
  openEditModal: (atiradorId: number, familyMember: any) => void;
  closeModal: () => void;
}

const FamilyMemberModalContext = createContext<FamilyMemberModalContextType | null>(null);

export function FamilyMemberModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAtiradorId, setSelectedAtiradorId] = useState<number | null>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null);

  const openCreateModal = (atiradorId: number) => {
    setSelectedAtiradorId(atiradorId);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (atiradorId: number, familyMember: any) => {
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
