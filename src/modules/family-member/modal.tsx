"use client";

import { useFamilyMemberModal } from "@/contexts/family-member-modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useTransition } from "react";
import { createFamilyMember, updateFamilyMember } from "@/actions/family-members";

export default function FamilyMemberModal() {
  const {
    isModalOpen,
    modalMode,
    selectedAtiradorId,
    selectedFamilyMember,
    closeModal,
  } = useFamilyMemberModal();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (modalMode === "edit" && selectedFamilyMember) {
      setName(selectedFamilyMember.name);
      setAge(selectedFamilyMember.age.toString());
    } else {
      setName("");
      setAge("");
    }
  }, [modalMode, selectedFamilyMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAtiradorId) return;

    startTransition(async () => {
      if (modalMode === "create") {
        const res = await createFamilyMember({
          atiradorId: selectedAtiradorId,
          name,
          age: parseInt(age),
          payment: {
            status: "PENDING",
            value: 0,
            method: "CASH" // Default method, adjust as needed or pass from form
          }
        });
        if (res.success) {
          closeModal();
          setName("");
          setAge("");
        }
      } else if (modalMode === "edit" && selectedFamilyMember) {
        const res = await updateFamilyMember(selectedFamilyMember.id, {
          name,
          age: parseInt(age),
        });
        if (res.success) {
          closeModal();
          setName("");
          setAge("");
        }
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {modalMode === "create" ? "Adicionar Familiar" : "Editar Familiar"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do familiar"
              required
            />
          </div>
          <div>
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Idade"
              required
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}