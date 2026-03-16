"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";
import AtiradorTableRow from "./table-row";
import FamilyMembersDetail from "../family-member/details";
import CreateAtiradorButton from "./create-button";
import { AtiradorFilters } from "./filters";
import { AtiradorWithRelations } from "@packages/types";
import { Users } from "lucide-react";

type Props = {
  atiradores: AtiradorWithRelations[];
  filters: { name: string; number: string; status: string };
};

export default function AtiradoresList({ atiradores, filters }: Props) {
  if (!atiradores) return null;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-green-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Users className="h-5 w-5" />
            Efetivo de Atiradores
          </h2>
          <CreateAtiradorButton />
        </div>

        <AtiradorFilters filters={filters} totalCount={atiradores.length} />

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
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
                  colSpan={4}
                  className="text-center py-8 text-slate-500 text-sm"
                >
                  Nenhum atirador encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              atiradores.map((atirador) => (
                <Fragment key={atirador.id}>
                  <AtiradorTableRow atirador={atirador} />
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
