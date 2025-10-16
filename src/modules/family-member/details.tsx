import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, PlusCircle, Repeat } from "lucide-react";
import { PaymentStatus } from "@prisma/client";
import { useDashboard } from "@/contexts/dashboard-context";
import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import { useFamilyMemberModal } from "@/contexts/family-member-modal-context"; // Garantir que a importação vem do contexto
import { useUpdatePayment } from "@/hooks/payments/use-update-payment";

export default function FamilyMembersDetail({ atiradorId }: { atiradorId: number }) {
  const { expandedRowId } = useDashboard();
  const { data: atiradores } = useGetAllAtiradores();
  const { openCreateModal, openEditModal } = useFamilyMemberModal();
  const { mutate: updatePayment } = useUpdatePayment();

  const atirador = atiradores?.find(a => a.id === atiradorId);
  
  if (!atirador || expandedRowId !== atiradorId) return null;

  const handleUpdateStatus = (paymentId: number, newStatus: PaymentStatus) => {
    updatePayment({ 
      id: paymentId, 
      data: { status: newStatus } 
    });
  };

  return (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="p-4 bg-muted/30 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Familiares de {atirador.name}:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openCreateModal(atiradorId);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Familiar
            </Button>
          </div>
          {atirador.familyMembers.length > 0 ? (
            <ul className="space-y-2">
              {atirador.familyMembers.map((member: FamilyMember) => {
                const isExempt = member.age < 6;
                const isPaid = member.payment?.status === PaymentStatus.PAID;

                return (
                  <li
                    key={member.id}
                    className="flex justify-between items-center p-2 rounded hover:bg-background"
                  >
                    <div className="flex items-center gap-4">
                      <span>{member.name} (Idade: {member.age})</span>
                      {isExempt ? (
                        <Badge variant="secondary">Isento</Badge>
                      ) : isPaid ? (
                        <Badge className="bg-green-500 text-white">Pago</Badge>
                      ) : (
                        <Badge variant="destructive">Pendente</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!isExempt && member.payment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(
                              member.payment!.id,
                              isPaid ? PaymentStatus.PENDING : PaymentStatus.PAID
                            );
                          }}
                        >
                           <Repeat className="h-4 w-4 mr-2" />
                           {isPaid ? "Marcar Pendente" : "Marcar Pago"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(atiradorId, member);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
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
        </div>
      </TableCell>
    </TableRow>
  );
}