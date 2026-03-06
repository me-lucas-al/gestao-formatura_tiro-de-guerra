"use client";

import { createContext, useContext, useState } from "react";
import { AtiradorWithRelations } from "@packages/types";

interface AtiradorModalContextType {
    isModalOpen: boolean;
    modalMode: "create" | "edit";
    selectedAtirador: AtiradorWithRelations | null;
    openCreateModal: () => void;
    openEditModal: (atirador: AtiradorWithRelations) => void;
    closeModal: () => void;
}

const AtiradorModalContext = createContext<AtiradorModalContextType | null>(null);

export function AtiradorModalProvider({ children }: { children: React.ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedAtirador, setSelectedAtirador] = useState<AtiradorWithRelations | null>(null);

    const openCreateModal = () => {
        setModalMode("create");
        setIsModalOpen(true);
    };

    const openEditModal = (atirador: AtiradorWithRelations) => {
        setSelectedAtirador(atirador);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAtirador(null);
    };

    return (
        <AtiradorModalContext.Provider
            value={{
                isModalOpen,
                modalMode,
                selectedAtirador,
                openCreateModal,
                openEditModal,
                closeModal,
            }}
        >
            {children}
        </AtiradorModalContext.Provider>
    );
}

export function useAtiradorModal() {
    const context = useContext(AtiradorModalContext);
    if (!context) {
        throw new Error("useAtiradorModal must be used within AtiradorModalProvider");
    }
    return context;
}
