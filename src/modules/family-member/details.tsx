"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, PlusCircle, Repeat, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { useFamilyMemberModal } from "@/contexts/family-member-modal-context";
import { deleteFamilyMember, updateFamilyMember } from "@/actions/family-members";
import { useState, useTransition } from "react";

export default function FamilyMembersDetail({ atirador }: { atirador: any }) {
  const { expandedRowId } = useDashboard();
  const { openCreateModal, openEditModal } = useFamilyMemberModal();
  const [isPending, startTransition] = useTransition();

  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editMethod, setEditMethod] = useState("CASH");

  const atiradorId = atirador.id;

  if (!atirador || expandedRowId !== atiradorId) return null;

  const closePaymentEdit = () => {
    setEditingMemberId(null);
  };

  const submitPaymentUpdate = () => {
    if (!editingMemberId) return;
    const member = atirador.familyMembers?.find((m: any) => m.id === editingMemberId);

    startTransition(async () => {
      await updateFamilyMember(editingMemberId, {
        name: member?.name, // necessary to pass schema validation perhaps, wait no, schema might require it
        age: member?.age,
        payment: {
          status: editStatus,
          method: (editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID") ? editMethod : "CASH",
        }
      });
      closePaymentEdit();
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500 text-white">Pago</Badge>;
      case "FIRST_INSTALLMENT_PAID":
        return <Badge className="bg-blue-500 text-white">1ª Parcela Paga</Badge>;
      case "CANCELED":
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="destructive">Pendente</Badge>;
    }
  };

  const showPaymentMethod = editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID";

  return (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="p-4 bg-muted/30 rounded-md relative">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Familiares de {atirador.name}:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openCreateModal(atiradorId);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Familiar
            </Button>
          </div>
          {atirador.familyMembers?.length > 0 ? (
            <ul className="space-y-2">
              {atirador.familyMembers.map((member: any) => {
                const isExempt = member.age < 6;

                return (
                  <li
                    key={member.id}
                    className="flex justify-between items-center p-2 rounded hover:bg-background"
                  >
                    <div className="flex items-center gap-4">
                      <span>{member.name} (Idade: {member.age})</span>
                      {isExempt ? (
                        <Badge variant="secondary">Isento</Badge>
                      ) : (
                        getStatusBadge(member.payment?.status)
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isExempt && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMemberId(member.id);
                            setEditStatus(member.payment?.status || "PENDING");
                            setEditMethod(member.payment?.method || "CASH");
                          }}
                        >
                          <Repeat className="h-4 w-4 mr-2" />
                          Mudar Status
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(atiradorId, member);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Excluir Familiar"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Tem certeza que deseja excluir o familiar ${member.name}?`)) {
                            startTransition(async () => {
                              await deleteFamilyMember(member.id);
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum familiar cadastrado.
            </p>
          )}

          <Dialog open={editingMemberId !== null} onOpenChange={(open) => {
            if (!open) closePaymentEdit();
          }}>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Mudar Status do Pagamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
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
                    <Select value={editMethod} onValueChange={setEditMethod}>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closePaymentEdit}>
                  Cancelar
                </Button>
                <Button onClick={submitPaymentUpdate} disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
}