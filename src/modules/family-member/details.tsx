"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, PlusCircle, Repeat, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { deleteFamilyMember, updateFamilyMember, createFamilyMember } from "@/actions/family-members";
import { useState, useTransition } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { AtiradorWithRelations } from "@packages/types";
import { Input } from "@/components/ui/input";

export default function FamilyMembersDetail({ atirador }: { atirador: AtiradorWithRelations }) {
  const { expandedRowId } = useDashboard();
  const { confirm } = useConfirm();
  const [isPending, startTransition] = useTransition();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createAge, setCreateAge] = useState("");
  const [createPaymentStatus, setCreatePaymentStatus] = useState("PENDING");
  const [createPaymentMethod, setCreatePaymentMethod] = useState("CASH");

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
    const member = atirador.familyMembers?.find((m) => m.id === editingMemberId);

    startTransition(async () => {
      await updateFamilyMember(editingMemberId, {
        name: member?.name, // necessary to pass schema validation perhaps, wait no, schema might require it
        age: member?.age,
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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateName("");
                  setCreateAge("");
                  setCreatePaymentStatus("PENDING");
                  setCreatePaymentMethod("CASH");
                  setIsCreateDialogOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Familiar
              </Button>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Adicionar Familiar</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    startTransition(async () => {
                      const parsedAge = parseInt(createAge);
                      const isExempt = !isNaN(parsedAge) && parsedAge < 6;
                      const paymentData = isExempt
                        ? undefined
                        : {
                          status: createPaymentStatus as "PENDING" | "PAID" | "FIRST_INSTALLMENT_PAID" | "CANCELED",
                          value: 0,
                          method: (createPaymentStatus === "PAID" || createPaymentStatus === "FIRST_INSTALLMENT_PAID" ? createPaymentMethod : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
                        };
                      await createFamilyMember({
                        atiradorId,
                        name: createName,
                        age: parsedAge,
                        payment: paymentData,
                      });
                      setIsCreateDialogOpen(false);
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="createName">Nome</Label>
                    <Input
                      id="createName"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Nome do familiar"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="createAge">Idade</Label>
                    <Input
                      id="createAge"
                      type="number"
                      value={createAge}
                      onChange={(e) => setCreateAge(e.target.value)}
                      placeholder="Idade"
                      required
                      min="0"
                    />
                  </div>
                  {!(parseInt(createAge) < 6) && (
                    <>
                      <div>
                        <Label>Status do Pagamento</Label>
                        <Select value={createPaymentStatus} onValueChange={setCreatePaymentStatus}>
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
                      {(createPaymentStatus === "PAID" || createPaymentStatus === "FIRST_INSTALLMENT_PAID") && (
                        <div>
                          <Label>Método de Pagamento</Label>
                          <Select value={createPaymentMethod} onValueChange={setCreatePaymentMethod}>
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
                    </>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {atirador.familyMembers?.length > 0 ? (
            <ul className="space-y-2">
              {atirador.familyMembers.map((member) => {
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
                      <Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <DialogTrigger onClick={(e) => e.stopPropagation()}>
                            <Pencil className="h-4 w-4" />
                          </DialogTrigger>
                        </Button>
                        <DialogContent onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle>Editar Familiar</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              startTransition(async () => {
                                const formData = new FormData(e.currentTarget);
                                const editName = formData.get("editName") as string;
                                const editAge = formData.get("editAge") as string;
                                const editStatus = formData.get("editStatus") as string;
                                const editMethod = formData.get("editMethod") as string;
                                const parsedAge = parseInt(editAge);
                                const isExempt = !isNaN(parsedAge) && parsedAge < 6;
                                const paymentData = isExempt
                                  ? undefined
                                  : {
                                    status: editStatus as "PENDING" | "PAID" | "FIRST_INSTALLMENT_PAID" | "CANCELED",
                                    value: 0,
                                    method: (editStatus === "PAID" || editStatus === "FIRST_INSTALLMENT_PAID" ? editMethod : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
                                  };
                                await updateFamilyMember(member.id, {
                                  name: editName,
                                  age: parsedAge,
                                  payment: paymentData,
                                });
                                // dialog will close if form isn't controlled with state when it re-renders. A generic unmanaged dialog.
                              });
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <Label htmlFor="editName">Nome</Label>
                              <Input id="editName" name="editName" defaultValue={member.name} placeholder="Nome do familiar" required />
                            </div>
                            <div>
                              <Label htmlFor="editAge">Idade</Label>
                              <Input id="editAge" name="editAge" type="number" defaultValue={member.age} placeholder="Idade" required min="0" />
                            </div>
                            {!isExempt && (
                              <>
                                <div>
                                  <Label>Status do Pagamento</Label>
                                  <Select name="editStatus" defaultValue={member.payment?.status || "PENDING"}>
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
                                {(member.payment?.status === "PAID" || member.payment?.status === "FIRST_INSTALLMENT_PAID") && (
                                  <div>
                                    <Label>Método de Pagamento</Label>
                                    <Select name="editMethod" defaultValue={member.payment?.method || "CASH"}>
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
                              </>
                            )}
                            <div className="flex justify-end gap-2 pt-2">
                              {/* Using unmanaged standard Dialog close technique. Actually, DialogClose from shadcn isn't imported. I will just rely on native save closing it since it updates parent or maybe just let user click out or esc. Wait, the unmanaged Dialog doesn't auto close on submit. Let's make it managed for editing too. */}
                              <Button type="submit" disabled={isPending}>
                                {isPending ? "Salvando..." : "Salvar (Clique fora para fechar)"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Excluir Familiar"
                        disabled={isPending}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const confirmed = await confirm({
                            title: "Excluir familiar",
                            description: `Tem certeza que deseja excluir o familiar ${member.name}?`,
                            confirmText: "Excluir",
                            cancelText: "Cancelar"
                          });

                          if (confirmed) {
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