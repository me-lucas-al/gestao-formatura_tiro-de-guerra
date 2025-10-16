import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Repeat } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import { useUpdatePayment } from "@/hooks/payments/use-update-payment";
import { PaymentStatus } from "@prisma/client";

export default function AtiradorTableRow({ atiradorId }: { atiradorId: number }) {
  const { expandedRowId, toggleRow } = useDashboard();
  const { data: atiradores } = useGetAllAtiradores();
  const { mutate: updatePaymentStatus } = useUpdatePayment();
  
  const atirador = atiradores?.find(a => a.id === atiradorId);
  if (!atirador) return null;

  const isExpanded = expandedRowId === atiradorId;
  
  // Verifica o status do pagamento do atirador
  const atiradorIsPaid = atirador.payment?.status === PaymentStatus.PAID;
  
  // Verifica se todos os familiares estão pagos ou isentos
  const allFamilyPaidOrExempt = atirador.familyMembers.every((member) => {
    if (member.age < 6) return true;
    return member.payment?.status === PaymentStatus.PAID;
  });

  // Status geral: atirador pago + todos os familiares regularizados
  const isFullyPaid = atiradorIsPaid && (atirador.familyMembers.length === 0 || allFamilyPaidOrExempt);

  const handleToggleAtiradorStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (atirador.payment) {
      updatePaymentStatus({
        paymentId: atirador.payment.id,
        status: atiradorIsPaid ? PaymentStatus.PENDING : PaymentStatus.PAID
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
      <TableCell>{atirador.familyMembers.length} familiar(es)</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {atirador.payment && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAtiradorStatus}
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