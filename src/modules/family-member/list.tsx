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
import { UsersRound } from "lucide-react";

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
  if (!familyMembers) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-green-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <UsersRound className="h-5 w-5" />
            Relação de Familiares
          </h2>
        </div>

        <FamilyMemberFilters filters={filters} totalCount={familyMembers.length} />

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
