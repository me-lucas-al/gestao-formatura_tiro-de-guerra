import { useFamilyMemberModal } from "@/lib/utils/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useCreateFamilyMember } from "@/hooks/familyMembers/use-create-family-member";
import { useUpdateFamilyMember } from "@/hooks/familyMembers/use-update-family-member";

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

  const { mutate: createFamilyMember, isPending: isCreating } = useCreateFamilyMember();
  const { mutate: updateFamilyMember, isPending: isUpdating } = useUpdateFamilyMember();

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

    if (modalMode === "create") {
      createFamilyMember(
        {
          atiradorId: selectedAtiradorId,
          name,
          age: parseInt(age),
        },
        {
          onSuccess: () => {
            closeModal();
            setName("");
            setAge("");
          },
        }
      );
    } else if (modalMode === "edit" && selectedFamilyMember) {
      updateFamilyMember(
        {
          id: selectedFamilyMember.id,
          name,
          age: parseInt(age),
        },
        {
          onSuccess: () => {
            closeModal();
            setName("");
            setAge("");
          },
        }
      );
    }
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
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}