import { useState } from "react";

type FamilyMember = {
  id: number;
  name: string;
};

export function useFamilyMemberModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAtiradorId, setSelectedAtiradorId] = useState<number | null>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);

  const openCreateModal = (atiradorId: number) => {
    setModalMode('create');
    setSelectedAtiradorId(atiradorId);
    setSelectedFamilyMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setModalMode('edit');
    setSelectedFamilyMember(member);
    setSelectedAtiradorId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAtiradorId(null);
    setSelectedFamilyMember(null);
  };

  return {
    isModalOpen,
    modalMode,
    selectedAtiradorId,
    selectedFamilyMember,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}