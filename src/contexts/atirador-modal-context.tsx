"use client";

import { createContext, useContext, useState } from "react";

interface AtiradorModalContextType {
    isModalOpen: boolean;
    modalMode: "create" | "edit";
    selectedAtirador: any;
    openCreateModal: () => void;
    openEditModal: (atirador: any) => void;
    closeModal: () => void;
}

const AtiradorModalContext = createContext<AtiradorModalContextType | null>(null);

export function AtiradorModalProvider({ children }: { children: React.ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedAtirador, setSelectedAtirador] = useState<any>(null);

    const openCreateModal = () => {
        setModalMode("create");
        setIsModalOpen(true);
    };

    const openEditModal = (atirador: any) => {
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
