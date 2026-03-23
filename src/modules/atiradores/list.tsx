"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useMemo, useState, useTransition } from "react";
import AtiradorTableRow from "./table-row";
import FamilyMembersDetail from "../family-member/details";
import CreateAtiradorButton from "./create-button";
import { AtiradorFilters } from "./filters";
import { AtiradorWithRelations } from "@packages/types";
import { Trash2, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { deleteAtirador } from "@/actions/atiradores";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

type Props = {
  atiradores: AtiradorWithRelations[];
  filters: { name: string; number: string; status: string };
};

export default function AtiradoresList({ atiradores, filters }: Props) {
  const { confirm } = useConfirm();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const allIds = useMemo(() => (atiradores ?? []).map((atirador) => atirador.id), [atiradores]);
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
      title: "Apagar atiradores selecionados",
      description: `Voce esta prestes a apagar ${selectedIds.length} atirador(es). Esta acao tambem remove familiares e pagamentos vinculados.`,
      confirmText: "Apagar selecionados",
      cancelText: "Cancelar",
    });

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const results = await Promise.all(selectedIds.map((id) => deleteAtirador(id)));
      const failed = results.filter((result) => !result.success);

      if (failed.length === 0) {
        toast.success("Atiradores selecionados removidos com sucesso.");
        setSelectedIds([]);
        return;
      }

      const removedCount = results.length - failed.length;
      if (removedCount > 0) {
        toast.success(`${removedCount} atirador(es) removido(s).`);
      }
      toast.error(`Falha ao remover ${failed.length} atirador(es).`);
    });
  };

  return (
    <div id="section-atiradores" className="mb-8">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-green-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Users className="h-5 w-5" />
            Efetivo de Atiradores
          </h2>
          <div className="flex items-center gap-2">
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
            <CreateAtiradorButton />
          </div>
        </div>

        <AtiradorFilters filters={filters} totalCount={atiradores.length} />

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[48px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(value) => toggleSelectAll(value === true)}
                  aria-label="Selecionar todos os atiradores"
                />
              </TableHead>
              <TableHead className="w-[100px] text-xs font-semibold uppercase tracking-wider text-slate-600">
                Numero
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Nome
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Familiares
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Acoes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {atiradores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500 text-sm"
                >
                  Nenhum atirador encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              atiradores.map((atirador) => (
                <Fragment key={atirador.id}>
                  <AtiradorTableRow
                    atirador={atirador}
                    isSelected={selectedIds.includes(atirador.id)}
                    onSelectChange={toggleSelectOne}
                  />
                  <FamilyMembersDetail atirador={atirador} />
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
