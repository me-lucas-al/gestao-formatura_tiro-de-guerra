"use client";

import { useAtiradorModal } from "@/contexts/atirador-modal-context";
import AtiradorModal from "./modal";

export default function AtiradorModalWrapper() {
    const { isModalOpen } = useAtiradorModal();

    if (!isModalOpen) return null;

    return <AtiradorModal />;
}
