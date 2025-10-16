import { useFamilyMemberModal } from "@/contexts/family-member-modal-context"; // Garantir que a importação vem do contexto
import FamilyMemberModal from "./modal";

export default function FamilyMemberModalWrapper() {
  const {
    isModalOpen,
    modalMode,
    selectedAtiradorId,
    selectedFamilyMember,
    closeModal,
  } = useFamilyMemberModal();

  if (!isModalOpen) return null;

  return (
    <FamilyMemberModal
      isOpen={isModalOpen}
      onClose={closeModal}
      mode={modalMode}
      atiradorId={selectedAtiradorId}
      familyMemberData={selectedFamilyMember}
    />
  );
}