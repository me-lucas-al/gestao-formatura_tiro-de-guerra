"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Pencil, Repeat, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { updatePayment } from "@/actions/payments";
import { deleteAtirador } from "@/actions/atiradores";
import { useAtiradorModal } from "@/contexts/atirador-modal-context";
import { useState, useTransition } from "react";

export default function AtiradorTableRow({ atirador }: { atirador: any }) {
  const { expandedRowId, toggleRow } = useDashboard();
  const { openEditModal } = useAtiradorModal();
  const [isPending, startTransition] = useTransition();

  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editMethod, setEditMethod] = useState("CASH");

  const atiradorId = atirador.id;

  if (!atirador) return null;

  const isExpanded = expandedRowId === atiradorId;
  const atiradorIsPaid = atirador.payment?.status === "PAID";

  const allFamilyPaidOrExempt = atirador.familyMembers?.every((member: any) => {
    if (member.age < 6) return true;
    return member.payment?.status === "PAID";
  });

  const isFullyPaid = atiradorIsPaid && (!atirador.familyMembers || atirador.familyMembers.length === 0 || allFamilyPaidOrExempt);

  const closePaymentEdit = () => {
    setEditingPaymentId(null);
  };

  const submitPaymentUpdate = () => {
    if (!editingPaymentId) return;
    startTransition(async () => {
      await updatePayment(editingPaymentId, {
        id: editingPaymentId,
        status: editStatus,
        method: (editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID") ? editMethod : "CASH",
      });
      closePaymentEdit();
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500 text-white text-xs">Pago</Badge>;
      case "FIRST_INSTALLMENT_PAID":
        return <Badge className="bg-blue-500 text-white text-xs">1ª Parcela Paga</Badge>;
      case "CANCELED":
        return <Badge variant="secondary" className="text-xs">Cancelado</Badge>;
      default:
        return <Badge variant="destructive" className="text-xs">Pendente</Badge>;
    }
  };

  const showPaymentMethod = editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID";

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => toggleRow(atiradorId)}
    >
      <TableCell className="font-medium flex items-center gap-2">
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        {atirador.number}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span>{atirador.name}</span>
          <div className="flex items-center gap-2">
            {getStatusBadge(atirador.payment?.status)}
          </div>
        </div>
      </TableCell>
      <TableCell>{atirador.familyMembers?.length || 0} familiar(es)</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {atirador.payment && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingPaymentId(atirador.payment.id);
                  setEditStatus(atirador.payment.status || "PENDING");
                  setEditMethod(atirador.payment.method || "CASH");
                }}
                disabled={isPending}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Mudar Status
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(atirador);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Excluir Atirador"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Atenção: A exclusão do atirador também excluirá todos os familiares e pagamentos vinculados a ele.\n\nTem certeza que deseja excluir o atirador ${atirador.name}?`)) {
                    startTransition(async () => {
                      await deleteAtirador(atirador.id);
                    });
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {isFullyPaid ? (
            <Badge className="bg-green-500 text-white">Regularizado</Badge>
          ) : (
            <Badge variant="destructive">Pendências</Badge>
          )}
        </div>

        <Dialog open={editingPaymentId !== null} onOpenChange={(open) => {
          if (!open) closePaymentEdit();
        }}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Mudar Status do Pagamento (Atirador)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 text-left">
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
      </TableCell>
    </TableRow>
  );
}