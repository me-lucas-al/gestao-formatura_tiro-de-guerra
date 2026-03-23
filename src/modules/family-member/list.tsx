"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FamilyMemberWithRelations } from "@packages/types";
import { FamilyMemberFilters } from "./filters";
import { Trash2, UsersRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useTransition } from "react";
import { deleteFamilyMember } from "@/actions/family-members";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

function getStatusBadge(member: FamilyMemberWithRelations) {
  if (member.age < 6 || member.payment?.status === "ISENTO") {
    return (
      <Badge className="bg-purple-700 text-white text-xs rounded-sm font-bold uppercase tracking-wider">
        Isento
      </Badge>
    );
  }
  switch (member.payment?.status) {
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
}

type Props = {
  familyMembers: FamilyMemberWithRelations[];
  filters: { name: string; status: string };
};

export default function FamilyMembersList({ familyMembers, filters }: Props) {
  const { confirm } = useConfirm();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();

  const allIds = useMemo(
    () => familyMembers.map((familyMember) => familyMember.id),
    [familyMembers],
  );
  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;
  const hasSelection = selectedIds.length > 0;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(allIds);
      return;
    }

    setSelectedIds([]);
  };

  const toggleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((previous) => (previous.includes(id) ? previous : [...previous, id]));
      return;
    }

    setSelectedIds((previous) => previous.filter((itemId) => itemId !== id));
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirm({
      title: "Apagar familiares selecionados",
      description: `Voce esta prestes a apagar ${selectedIds.length} familiar(es). Esta acao nao pode ser desfeita.`,
      confirmText: "Apagar selecionados",
      cancelText: "Cancelar",
    });

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const results = await Promise.all(
        selectedIds.map((familyMemberId) => deleteFamilyMember(familyMemberId)),
      );
      const failed = results.filter((result) => !result.success);

      if (failed.length === 0) {
        toast.success("Familiares selecionados removidos com sucesso.");
        setSelectedIds([]);
        return;
      }

      const removedCount = results.length - failed.length;
      if (removedCount > 0) {
        toast.success(`${removedCount} familiar(es) removido(s).`);
      }
      toast.error(`Falha ao remover ${failed.length} familiar(es).`);
    });
  };

  return (
    <div id="section-familiares" className="mb-8">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-green-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <UsersRound className="h-5 w-5" />
            Relação de Familiares
          </h2>
          {hasSelection ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBulkDelete}
              disabled={isPending}
              className="h-8 rounded-sm border-red-200 bg-white px-3 text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Apagar Selecionados ({selectedIds.length})
            </Button>
          ) : null}
        </div>

        <FamilyMemberFilters filters={filters} totalCount={familyMembers.length} />

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[48px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(value) => toggleSelectAll(value === true)}
                  aria-label="Selecionar todos os familiares"
                />
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nome do Familiar
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Idade
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Atirador Associado
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Acoes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500 text-sm"
                >
                  Nenhum familiar encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              familyMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(member.id)}
                      onCheckedChange={(value) =>
                        toggleSelectOne(member.id, value === true)
                      }
                      aria-label={`Selecionar familiar ${member.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-slate-600">{member.age}</TableCell>
                  <TableCell className="text-slate-600">
                    {member.atirador?.name || "Não associado"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getStatusBadge(member)}
                      {member.payment?.value ? (
                        <span className="text-xs text-slate-500 font-medium">
                          R$ {member.payment.value.toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={async () => {
                        const confirmed = await confirm({
                          title: "Excluir familiar",
                          description: `Tem certeza que deseja excluir o familiar ${member.name}?`,
                          confirmText: "Excluir",
                          cancelText: "Cancelar",
                        });

                        if (!confirmed) {
                          return;
                        }

                        startTransition(async () => {
                          const result = await deleteFamilyMember(member.id);

                          if (result.success) {
                            toast.success("Familiar removido com sucesso.");
                            return;
                          }

                          toast.error(result.error ?? "Erro ao remover familiar.");
                        });
                      }}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
