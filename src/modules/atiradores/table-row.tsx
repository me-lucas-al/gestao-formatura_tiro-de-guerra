"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Repeat,
  Trash2,
} from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { deleteAtirador, updateAtirador } from "@/actions/atiradores";
import { useState, useTransition, useEffect } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { AtiradorWithRelations } from "@packages/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type FamilyMember = { age: number; payment?: { status: string } | null };

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-green-900 text-white text-xs rounded-sm font-bold uppercase tracking-wider">
          Pago
        </Badge>
      );
    case "FIRST_INSTALLMENT_PAID":
      return (
        <Badge className="bg-amber-600 text-white text-xs rounded-sm font-bold uppercase tracking-wider">
          1a Parcela
        </Badge>
      );
    case "CANCELED":
      return (
        <Badge className="bg-slate-400 text-white text-xs rounded-sm font-bold uppercase tracking-wider">
          Cancelado
        </Badge>
      );
    default:
      return (
        <Badge className="bg-red-700 text-white text-xs rounded-sm font-bold uppercase tracking-wider">
          Pendente
        </Badge>
      );
  }
};

export default function AtiradorTableRow({
  atirador,
}: {
  atirador: AtiradorWithRelations;
}) {
  const { expandedRowId, toggleRow } = useDashboard();
  const { confirm } = useConfirm();
  const [isPending, startTransition] = useTransition();

  const [editingAtiradorId, setEditingAtiradorId] = useState<number | null>(
    null,
  );
  const [editStatus, setEditStatus] = useState<string>("PENDING");
  const [editMethod, setEditMethod] = useState<string>("CASH");
  const [editStatusValue, setEditStatusValue] = useState<string>("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(atirador.name);
  const [editNumber, setEditNumber] = useState(atirador.number?.toString() || "");
  const [editAtiradorStatus, setEditAtiradorStatus] = useState<string>(
    atirador.payment?.status || "PENDING",
  );
  const [editAtiradorMethod, setEditAtiradorMethod] = useState<string>(
    atirador.payment?.method || "CASH",
  );
  const [editAtiradorValue, setEditAtiradorValue] = useState<string>(
    atirador.payment?.value?.toString() || "",
  );

  useEffect(() => {
    if (isEditDialogOpen) {
      setEditName(atirador.name);
      setEditNumber(atirador.number?.toString() || "");
      setEditAtiradorStatus(atirador.payment?.status || "PENDING");
      setEditAtiradorMethod(atirador.payment?.method || "CASH");
      setEditAtiradorValue(atirador.payment?.value?.toString() || "");
    }
  }, [isEditDialogOpen, atirador]);

  const atiradorId = atirador.id;
  if (!atirador) return null;

  const isExpanded = expandedRowId === atiradorId;
  const atiradorIsPaid = atirador.payment?.status === "PAID";

  const allFamilyPaidOrExempt = atirador.familyMembers?.every(
    (member) => {
      return member.payment?.status === "PAID";
    },
  );

  const isFullyPaid =
    atiradorIsPaid &&
    (!atirador.familyMembers ||
      atirador.familyMembers.length === 0 ||
      allFamilyPaidOrExempt);

  const submitEditAtirador = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const paymentData = {
        status: editAtiradorStatus as
          | "PENDING"
          | "PAID"
          | "FIRST_INSTALLMENT_PAID"
          | "CANCELED",
        value: parseFloat(editAtiradorValue) || 0,
        method: (editAtiradorStatus === "PAID" ||
        editAtiradorStatus === "FIRST_INSTALLMENT_PAID"
          ? editAtiradorMethod
          : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
      };
      const res = await updateAtirador(atirador.id, {
        name: editName,
        number: parseInt(editNumber),
        payment: paymentData,
      });
      if (res.success) {
        toast.success("Atirador atualizado com sucesso.");
        setIsEditDialogOpen(false);
      } else {
        toast.error(res.error ?? "Erro ao atualizar atirador.");
      }
    });
  };

  const closePaymentEdit = () => setEditingAtiradorId(null);

  const submitPaymentUpdate = () => {
    if (!editingAtiradorId) return;
    startTransition(async () => {
      const res = await updateAtirador(editingAtiradorId, {
        payment: {
          status: editStatus as
            | "PENDING"
            | "PAID"
            | "FIRST_INSTALLMENT_PAID"
            | "CANCELED",
          value: parseFloat(editStatusValue) || 0,
          method: (editStatus === "PAID" ||
          editStatus === "FIRST_INSTALLMENT_PAID"
            ? editMethod
            : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
        },
      });
      if (res.success) {
        toast.success("Status atualizado com sucesso.");
        closePaymentEdit();
      } else {
        toast.error(res.error ?? "Erro ao atualizar status.");
      }
    });
  };

  const showPaymentMethod =
    editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID";

  return (
    <TableRow
      className="cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => toggleRow(atiradorId)}
    >
      <TableCell className="font-medium flex items-center gap-2">
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-green-900" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
        <span className="font-bold text-slate-900">{atirador.number}</span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-slate-900">{atirador.name}</span>
          <div className="flex items-center gap-2">
            {getStatusBadge(atirador.payment?.status)}
            {atirador.payment?.value ? (
              <span className="text-xs font-semibold text-slate-600">
                R$ {atirador.payment.value.toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-slate-600">
        {atirador.familyMembers?.length || 0} familiar(es)
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setEditingAtiradorId(atirador.id);
              setEditStatus(atirador.payment?.status || "PENDING");
              setEditMethod(atirador.payment?.method || "CASH");
              setEditStatusValue(atirador.payment?.value?.toString() || "");
            }}
            disabled={isPending}
          >
            <Repeat className="h-3 w-3 mr-1" />
            Status
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Excluir Atirador"
            disabled={isPending}
            onClick={async (e) => {
              e.stopPropagation();
              const confirmed = await confirm({
                title: "Excluir Atirador",
                description: `Atencao: A exclusao do atirador tambem excluira todos os familiares e pagamentos vinculados a ele.\n\nTem certeza que deseja excluir o atirador ${atirador.name}?`,
                confirmText: "Excluir",
                cancelText: "Cancelar",
              });
              if (confirmed) {
                startTransition(async () => {
                  const res = await deleteAtirador(atirador.id);
                  if (res.success) {
                    toast.success("Atirador removido com sucesso.");
                  } else {
                    toast.error(res.error ?? "Erro ao remover atirador.");
                  }
                });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {isFullyPaid ? (
            <Badge className="bg-green-900 text-white rounded-sm font-bold uppercase tracking-wider text-xs">
              Regularizado
            </Badge>
          ) : (
            <Badge className="bg-red-700 text-white rounded-sm font-bold uppercase tracking-wider text-xs">
              Pendencias
            </Badge>
          )}
        </div>

        {/* Modal Editar Atirador */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            onInteractOutside={(e) => e.preventDefault()}
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="uppercase tracking-wider text-slate-900">
                Editar Atirador
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={submitEditAtirador} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Numero
                </Label>
                <Input
                  type="number"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  placeholder="Numero do atirador (ex: 01)"
                  required
                  min="1"
                  className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Nome
                </Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nome do atirador"
                  required
                  className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Status do Pagamento
                </Label>
                <Select
                  value={editAtiradorStatus}
                  onValueChange={setEditAtiradorStatus}
                >
                  <SelectTrigger className="rounded-sm border-slate-300">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PAID">Pago</SelectItem>
                    <SelectItem value="FIRST_INSTALLMENT_PAID">
                      Primeira Parcela Paga
                    </SelectItem>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(editAtiradorStatus === "PAID" ||
                editAtiradorStatus === "FIRST_INSTALLMENT_PAID") && (
                <>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Metodo de Pagamento
                    </Label>
                    <Select
                      value={editAtiradorMethod}
                      onValueChange={setEditAtiradorMethod}
                    >
                      <SelectTrigger className="rounded-sm border-slate-300">
                        <SelectValue placeholder="Selecione o metodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Dinheiro</SelectItem>
                        <SelectItem value="CREDIT_CARD">
                          Cartao de Credito
                        </SelectItem>
                        <SelectItem value="DEBIT_CARD">
                          Cartao de Debito
                        </SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Valor do Pagamento (R$)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editAtiradorValue}
                      onChange={(e) => setEditAtiradorValue(e.target.value)}
                      placeholder="0.00"
                      className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                    />
                  </div>
                </>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-sm"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-green-900 hover:bg-green-800 rounded-sm uppercase tracking-wider font-semibold"
                >
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal Mudar Status */}
        <Dialog
          open={editingAtiradorId !== null}
          onOpenChange={(open) => {
            if (!open) closePaymentEdit();
          }}
        >
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            onInteractOutside={(e) => e.preventDefault()}
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="uppercase tracking-wider text-slate-900">
                Mudar Status do Pagamento
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 text-left">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Status
                </Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="rounded-sm border-slate-300">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PAID">Pago</SelectItem>
                    <SelectItem value="FIRST_INSTALLMENT_PAID">
                      Primeira Parcela Paga
                    </SelectItem>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showPaymentMethod && (
                <>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Metodo de Pagamento
                    </Label>
                    <Select value={editMethod} onValueChange={setEditMethod}>
                      <SelectTrigger className="rounded-sm border-slate-300">
                        <SelectValue placeholder="Selecione o metodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Dinheiro</SelectItem>
                        <SelectItem value="CREDIT_CARD">
                          Cartao de Credito
                        </SelectItem>
                        <SelectItem value="DEBIT_CARD">
                          Cartao de Debito
                        </SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Valor do Pagamento (R$)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editStatusValue}
                      onChange={(e) => setEditStatusValue(e.target.value)}
                      placeholder="0.00"
                      className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-sm"
                onClick={closePaymentEdit}
              >
                Cancelar
              </Button>
              <Button
                onClick={submitPaymentUpdate}
                disabled={isPending}
                className="bg-green-900 hover:bg-green-800 rounded-sm uppercase tracking-wider font-semibold"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
