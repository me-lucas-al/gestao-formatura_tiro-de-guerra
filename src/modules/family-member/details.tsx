"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Pencil, PlusCircle, Repeat, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import {
  deleteFamilyMember,
  updateFamilyMember,
  createFamilyMember,
} from "@/actions/family-members";
import { useState, useTransition } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { AtiradorWithRelations } from "@packages/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
    case "ISENTO":
      return (
        <Badge className="bg-slate-200 text-slate-700 text-xs rounded-sm font-bold uppercase tracking-wider">
          Isento
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

export default function FamilyMembersDetail({
  atirador,
}: {
  atirador: AtiradorWithRelations;
}) {
  const { expandedRowId } = useDashboard();
  const { confirm } = useConfirm();
  const [isPending, startTransition] = useTransition();

  // Criar familiar
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createAge, setCreateAge] = useState("");
  const [createPaymentStatus, setCreatePaymentStatus] = useState("PENDING");
  const [createPaymentMethod, setCreatePaymentMethod] = useState("CASH");
  const [createPaymentValue, setCreatePaymentValue] = useState("");

  // Mudar status pagamento
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editMethod, setEditMethod] = useState("CASH");
  const [editStatusValue, setEditStatusValue] = useState("");

  // Editar familiar (agora controlado com estado)
  const [editingFamilyId, setEditingFamilyId] = useState<number | null>(null);
  const [editFamilyName, setEditFamilyName] = useState("");
  const [editFamilyAge, setEditFamilyAge] = useState("");
  const [editFamilyStatus, setEditFamilyStatus] = useState("PENDING");
  const [editFamilyMethod, setEditFamilyMethod] = useState("CASH");
  const [editFamilyValue, setEditFamilyValue] = useState("");

  const atiradorId = atirador.id;

  if (!atirador || expandedRowId !== atiradorId) return null;

  const closePaymentEdit = () => setEditingMemberId(null);

  const submitPaymentUpdate = () => {
    if (!editingMemberId) return;
    const member = atirador.familyMembers?.find(
      (m) => m.id === editingMemberId,
    );
    startTransition(async () => {
      const res = await updateFamilyMember(editingMemberId, {
        name: member?.name,
        age: member?.age,
        payment: {
          status: editStatus as
            | "PENDING"
            | "PAID"
            | "FIRST_INSTALLMENT_PAID"
            | "CANCELED"
            | "ISENTO",
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

  const openEditFamily = (member: {
    id: number;
    name: string;
    age: number;
    payment?: { status: string; method: string; value?: number } | null;
  }) => {
    setEditingFamilyId(member.id);
    setEditFamilyName(member.name);
    setEditFamilyAge(member.age.toString());
    setEditFamilyStatus(member.payment?.status || "PENDING");
    setEditFamilyMethod(member.payment?.method || "CASH");
    setEditFamilyValue(member.payment?.value?.toString() || "");
  };

  const submitEditFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFamilyId) return;
    startTransition(async () => {
      const parsedAge = parseInt(editFamilyAge);
      const res = await updateFamilyMember(editingFamilyId, {
        name: editFamilyName,
        age: parsedAge,
        payment: {
          status: editFamilyStatus as
            | "PENDING"
            | "PAID"
            | "FIRST_INSTALLMENT_PAID"
            | "CANCELED"
            | "ISENTO",
          value: parseFloat(editFamilyValue) || 0,
          method: (editFamilyStatus === "PAID" ||
          editFamilyStatus === "FIRST_INSTALLMENT_PAID"
            ? editFamilyMethod
            : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
        },
      });
      if (res.success) {
        toast.success("Familiar atualizado com sucesso.");
        setEditingFamilyId(null);
      } else {
        toast.error(res.error ?? "Erro ao atualizar familiar.");
      }
    });
  };

  const showPaymentMethod =
    editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID";
  const showEditPaymentMethod =
    editFamilyStatus === "PAID" ||
    editFamilyStatus === "FIRST_INSTALLMENT_PAID";

  return (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-slate-700">
              Familiares de {atirador.name}
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setCreateName("");
                setCreateAge("");
                setCreatePaymentStatus("PENDING");
                setCreatePaymentMethod("CASH");
                setCreatePaymentValue("");
                setIsCreateDialogOpen(true);
              }}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          </div>

          {atirador.familyMembers?.length > 0 ? (
            <ul className="space-y-1">
              {atirador.familyMembers.map((member) => {
                return (
                  <li
                    key={member.id}
                    className="flex justify-between items-center p-2 rounded-sm hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900">
                        {member.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        Idade: {member.age}
                      </span>
                      {getStatusBadge(member.payment?.status)}
                      {member.payment?.value ? (
                        <span className="text-xs font-semibold text-slate-600">
                          R$ {member.payment.value.toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-sm text-xs h-7"
                        disabled={isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMemberId(member.id);
                          setEditStatus(member.payment?.status || "PENDING");
                          setEditMethod(member.payment?.method || "CASH");
                          setEditStatusValue(member.payment?.value?.toString() || "");
                        }}
                      >
                        <Repeat className="h-3 w-3 mr-1" />
                        Status
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditFamily(member);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Excluir Familiar"
                        disabled={isPending}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirmed = await confirm({
                            title: "Excluir familiar",
                            description: `Tem certeza que deseja excluir o familiar ${member.name}?`,
                            confirmText: "Excluir",
                            cancelText: "Cancelar",
                          });
                          if (confirmed) {
                            startTransition(async () => {
                              const res = await deleteFamilyMember(member.id);
                              if (res.success) {
                                toast.success("Familiar removido com sucesso.");
                              } else {
                                toast.error(res.error ?? "Erro ao remover familiar.");
                              }
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 py-2">
              Nenhum familiar cadastrado.
            </p>
          )}

          {/* Modal Criar Familiar */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent
              onClick={(e) => e.stopPropagation()}
              onInteractOutside={(e) => e.preventDefault()}
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle className="uppercase tracking-wider text-slate-900">
                  Adicionar Familiar
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    const parsedAge = parseInt(createAge);
                    const res = await createFamilyMember({
                      atiradorId,
                      name: createName,
                      age: parsedAge,
                      payment: {
                        status: createPaymentStatus as
                          | "PENDING"
                          | "PAID"
                          | "FIRST_INSTALLMENT_PAID"
                          | "CANCELED"
                          | "ISENTO",
                        value: parseFloat(createPaymentValue) || 0,
                        method: (createPaymentStatus === "PAID" ||
                        createPaymentStatus === "FIRST_INSTALLMENT_PAID"
                          ? createPaymentMethod
                          : "CASH") as
                          | "CASH"
                          | "CREDIT_CARD"
                          | "DEBIT_CARD"
                          | "PIX",
                      },
                    });
                    if (res.success) {
                      toast.success("Familiar adicionado com sucesso.");
                      setIsCreateDialogOpen(false);
                    } else {
                      toast.error(res.error ?? "Erro ao adicionar familiar.");
                    }
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Nome
                  </Label>
                  <Input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Nome do familiar"
                    required
                    className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Idade
                  </Label>
                  <Input
                    type="number"
                    value={createAge}
                    onChange={(e) => setCreateAge(e.target.value)}
                    placeholder="Idade"
                    required
                    min="0"
                    className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Status do Pagamento
                  </Label>
                  <Select
                    value={createPaymentStatus}
                    onValueChange={setCreatePaymentStatus}
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
                      <SelectItem value="ISENTO">Isento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(createPaymentStatus === "PAID" ||
                  createPaymentStatus === "FIRST_INSTALLMENT_PAID") && (
                  <>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Metodo de Pagamento
                      </Label>
                      <Select
                        value={createPaymentMethod}
                        onValueChange={setCreatePaymentMethod}
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
                        value={createPaymentValue}
                        onChange={(e) => setCreatePaymentValue(e.target.value)}
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
                    onClick={() => setIsCreateDialogOpen(false)}
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

          {/* Modal Editar Familiar (agora controlado) */}
          <Dialog
            open={editingFamilyId !== null}
            onOpenChange={(open) => {
              if (!open) setEditingFamilyId(null);
            }}
          >
            <DialogContent
              onClick={(e) => e.stopPropagation()}
              onInteractOutside={(e) => e.preventDefault()}
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle className="uppercase tracking-wider text-slate-900">
                  Editar Familiar
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={submitEditFamily} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Nome
                  </Label>
                  <Input
                    value={editFamilyName}
                    onChange={(e) => setEditFamilyName(e.target.value)}
                    placeholder="Nome do familiar"
                    required
                    className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Idade
                  </Label>
                  <Input
                    type="number"
                    value={editFamilyAge}
                    onChange={(e) => setEditFamilyAge(e.target.value)}
                    placeholder="Idade"
                    required
                    min="0"
                    className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Status do Pagamento
                  </Label>
                  <Select
                    value={editFamilyStatus}
                    onValueChange={setEditFamilyStatus}
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
                      <SelectItem value="ISENTO">Isento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {showEditPaymentMethod && (
                  <>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Metodo de Pagamento
                      </Label>
                      <Select
                        value={editFamilyMethod}
                        onValueChange={setEditFamilyMethod}
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
                        value={editFamilyValue}
                        onChange={(e) => setEditFamilyValue(e.target.value)}
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
                    onClick={() => setEditingFamilyId(null)}
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

          {/* Modal Mudar Status Pagamento */}
          <Dialog
            open={editingMemberId !== null}
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
              <div className="space-y-4 py-4">
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
                      <SelectItem value="ISENTO">Isento</SelectItem>
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
        </div>
      </TableCell>
    </TableRow>
  );
}
