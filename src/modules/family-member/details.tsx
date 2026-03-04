"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, PlusCircle, Repeat } from "lucide-react";
import { useDashboard } from "@/contexts/dashboard-context";
import { useFamilyMemberModal } from "@/contexts/family-member-modal-context";
import { updatePayment } from "@/actions/payments";
import { useTransition } from "react";

export default function FamilyMembersDetail({ atirador }: { atirador: any }) {
  const { expandedRowId } = useDashboard();
  const { openCreateModal, openEditModal } = useFamilyMemberModal();
  const [isPending, startTransition] = useTransition();

  const atiradorId = atirador.id;
  
  if (!atirador || expandedRowId !== atiradorId) return null;

  const handleUpdateStatus = (paymentId: number, newStatus: string) => {
    startTransition(async () => {
      await updatePayment(paymentId, { status: newStatus });
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
          {atirador.familyMembers?.length > 0 ? (
            <ul className="space-y-2">
              {atirador.familyMembers.map((member: any) => {
                const isExempt = member.age < 6;
                const isPaid = member.payment?.status === "PAID";

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
                          disabled={isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(
                              member.payment!.id,
                              isPaid ? "PENDING" : "PAID"
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