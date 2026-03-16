"use client";

import { useFamilyMemberModal } from "@/contexts/family-member-modal-context";
import FamilyMemberModal from "./modal";

export default function FamilyMemberModalWrapper() {
  const { isModalOpen } = useFamilyMemberModal();

  if (!isModalOpen) return null;

  return <FamilyMemberModal />;
}