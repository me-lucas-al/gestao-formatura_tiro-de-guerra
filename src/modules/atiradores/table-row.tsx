"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Repeat } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { updatePayment } from "@/actions/payments";
import { useTransition } from "react";

export default function AtiradorTableRow({ atirador }: { atirador: any }) {
  const { expandedRowId, toggleRow } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const atiradorId = atirador.id;
  
  if (!atirador) return null;

  const isExpanded = expandedRowId === atiradorId;
  
  // Verifica o status do pagamento do atirador
  const atiradorIsPaid = atirador.payment?.status === "PAID";
  
  // Verifica se todos os familiares estão pagos ou isentos
  const allFamilyPaidOrExempt = atirador.familyMembers?.every((member: any) => {
    if (member.age < 6) return true;
    return member.payment?.status === "PAID";
  });

  // Status geral: atirador pago + todos os familiares regularizados
  const isFullyPaid = atiradorIsPaid && (!atirador.familyMembers || atirador.familyMembers.length === 0 || allFamilyPaidOrExempt);

  const handleToggleAtiradorStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (atirador.payment) {
      startTransition(async () => {
        await updatePayment(atirador.payment.id, {
          status: atiradorIsPaid ? "PENDING" : "PAID"
        });
      });
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => toggleRow(atiradorId)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          {atirador.number}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span>{atirador.name}</span>
          <div className="flex items-center gap-2">
            {atiradorIsPaid ? (
              <Badge className="bg-green-500 text-white text-xs">Pago</Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">Pendente</Badge>
            )}
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
                onClick={handleToggleAtiradorStatus}
                disabled={isPending}
              >
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
          {isFullyPaid ? (
            <Badge className="bg-green-500 text-white">Regularizado</Badge>
          ) : (
            <Badge variant="destructive">Pagamentos Pendentes</Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}