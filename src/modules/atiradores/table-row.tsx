"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Pencil, Repeat, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { deleteAtirador, updateAtirador } from "@/actions/atiradores";
import { useState, useTransition, useEffect } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { AtiradorWithRelations } from "@packages/types";
import { Input } from "@/components/ui/input";

export default function AtiradorTableRow({ atirador }: { atirador: AtiradorWithRelations }) {
  const { expandedRowId, toggleRow } = useDashboard();
  const { confirm } = useConfirm();
  const [isPending, startTransition] = useTransition();

  const [editingAtiradorId, setEditingAtiradorId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("PENDING");
  const [editMethod, setEditMethod] = useState<string>("CASH");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(atirador.name);
  const [editNumber, setEditNumber] = useState(atirador.number.toString());
  const [editAtiradorStatus, setEditAtiradorStatus] = useState<string>(atirador.payment?.status || "PENDING");
  const [editAtiradorMethod, setEditAtiradorMethod] = useState<string>(atirador.payment?.method || "CASH");

  useEffect(() => {
    if (isEditDialogOpen) {
      setEditName(atirador.name);
      setEditNumber(atirador.number.toString());
      setEditAtiradorStatus(atirador.payment?.status || "PENDING");
      setEditAtiradorMethod(atirador.payment?.method || "CASH");
    }
  }, [isEditDialogOpen, atirador]);

  const submitEditAtirador = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const paymentData = {
        status: editAtiradorStatus as "PENDING" | "PAID" | "FIRST_INSTALLMENT_PAID" | "CANCELED",
        value: 0,
        method: (editAtiradorStatus === "PAID" || editAtiradorStatus === "FIRST_INSTALLMENT_PAID" ? editAtiradorMethod : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
      };
      await updateAtirador(atirador.id, {
        name: editName,
        number: parseInt(editNumber),
        payment: paymentData,
      });
      setIsEditDialogOpen(false);
    });
  };
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
    setEditingAtiradorId(null);
  };

  const submitPaymentUpdate = () => {
    if (!editingAtiradorId) return;
    startTransition(async () => {
      await updateAtirador(editingAtiradorId, {
        payment: {
          status: editStatus as "PENDING" | "PAID" | "FIRST_INSTALLMENT_PAID" | "CANCELED",
          value: 0,
          method: ((editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID") ? editMethod : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
        }
      });
      closePaymentEdit();
    });
  };

  const getStatusBadge = (status?: string) => {
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
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditingAtiradorId(atirador.id);
              setEditStatus(atirador.payment?.status || "PENDING");
              setEditMethod(atirador.payment?.method || "CASH");
            }}
            disabled={isPending}
          >
            <Repeat className="h-4 w-4 mr-2" />
            Mudar Status
          </Button>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Editar Atirador</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitEditAtirador} className="space-y-4">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    type="number"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    placeholder="Número do atirador (ex: 01)"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nome do atirador"
                    required
                  />
                </div>

                <div>
                  <Label>Status do Pagamento</Label>
                  <Select value={editAtiradorStatus} onValueChange={setEditAtiradorStatus}>
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

                {(editAtiradorStatus === "PAID" || editAtiradorStatus === "FIRST_INSTALLMENT_PAID") && (
                  <div>
                    <Label>Método de Pagamento</Label>
                    <Select value={editAtiradorMethod} onValueChange={setEditAtiradorMethod}>
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
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Excluir Atirador"
            disabled={isPending}
            onClick={async (e) => {
              e.stopPropagation();

              const confirmed = await confirm({
                title: "Excluir Atirador",
                description: `Atenção: A exclusão do atirador também excluirá todos os familiares e pagamentos vinculados a ele.\n\nTem certeza que deseja excluir o atirador ${atirador.name}?`,
                confirmText: "Excluir",
                cancelText: "Cancelar"
              });

              if (confirmed) {
                startTransition(async () => {
                  await deleteAtirador(atirador.id);
                });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {isFullyPaid ? (
            <Badge className="bg-green-500 text-white">Regularizado</Badge>
          ) : (
            <Badge variant="destructive">Pendências</Badge>
          )}
        </div>

        <Dialog open={editingAtiradorId !== null} onOpenChange={(open) => {
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