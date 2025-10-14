import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fragment } from "react";
import { PaymentStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Repeat } from "lucide-react";

type FamilyMember = {
  id: number;
  name: string;
  age: number;
  payment: {
    id: number;
    status: PaymentStatus;
  } | null;
};

type AtiradoresListProps = {
  atiradores: any[];
  handleRowClick: (id: number) => void;
  expandedRowId: number | null;
  onAddFamilyMember: (atiradorId: number) => void;
  onEditFamilyMember: (member: FamilyMember) => void;
  onUpdateFamilyMemberStatus: (paymentId: number, status: PaymentStatus) => void;
};

export default function AtiradoresList({
  atiradores,
  handleRowClick,
  expandedRowId,
  onAddFamilyMember,
  onEditFamilyMember,
  onUpdateFamilyMemberStatus,
}: AtiradoresListProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lista de Atiradores</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Familiares</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atiradores.map((atirador: any) => (
                <Fragment key={atirador.id}>
                  <TableRow
                    onClick={() => handleRowClick(atirador.id)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{atirador.number}</TableCell>
                    <TableCell>{atirador.name}</TableCell>
                    <TableCell>{atirador.familyMembers.length}</TableCell>
                    <TableCell className="text-right">
                      {atirador.payment?.status === PaymentStatus.PAID ? (
                        <Badge className="bg-green-600 text-white hover:bg-green-700">Pago</Badge>
                      ) : (
                        <Badge variant="destructive">Pendente</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRowId === atirador.id && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="p-4 bg-muted/30 rounded-md">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">Familiares de {atirador.name}:</h4>
                            <Button variant="outline" size="sm" onClick={() => onAddFamilyMember(atirador.id)}>
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
                                  <li key={member.id} className="flex justify-between items-center p-2 rounded hover:bg-background">
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
                                          onClick={() => onUpdateFamilyMemberStatus(
                                            member.payment!.id,
                                            isPaid ? PaymentStatus.PENDING : PaymentStatus.PAID
                                          )}
                                        >
                                          <Repeat className="h-4 w-4 mr-2" />
                                          {isPaid ? "Marcar Pendente" : "Marcar Pago"}
                                        </Button>
                                      )}
                                      <Button variant="ghost" size="icon" onClick={() => onEditFamilyMember(member)}>
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum familiar cadastrado.</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}