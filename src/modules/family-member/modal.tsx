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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (modalMode === "edit" && selectedFamilyMember) {
      setName(selectedFamilyMember.name);
      setAge(selectedFamilyMember.age.toString());
      setPaymentStatus(selectedFamilyMember.payment?.status || "PENDING");
      setPaymentMethod(selectedFamilyMember.payment?.method || "CASH");
    } else {
      setName("");
      setAge("");
      setPaymentStatus("PENDING");
      setPaymentMethod("CASH");
    }
  }, [modalMode, selectedFamilyMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAtiradorId) return;

    startTransition(async () => {
      const paymentData = {
        status: paymentStatus,
        value: 0,
        // Only consider method if PAID or FIRST_INSTALLMENT_PAID
        method: paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID" ? paymentMethod : "CASH",
      };

      if (modalMode === "create") {
        const res = await createFamilyMember({
          atiradorId: selectedAtiradorId,
          name,
          age: parseInt(age),
          payment: paymentData,
        });
        if (res.success) {
          closeModal();
        }
      } else if (modalMode === "edit" && selectedFamilyMember) {
        const res = await updateFamilyMember(selectedFamilyMember.id, {
          name,
          age: parseInt(age),
          payment: paymentData,
        });
        if (res.success) {
          closeModal();
        }
      }
    });
  };

  const showPaymentMethod = paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID";

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

          <div>
            <Label>Status do Pagamento</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="PAID">Pago</SelectItem>
                <SelectItem value="FIRST_INSTALLMENT_PAID">Primeira Parcela Paga</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showPaymentMethod && (
            <div>
              <Label>Método de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Dinheiro</SelectItem>
                  <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                  <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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