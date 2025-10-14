"use client";

import { useGetAllFamilyMembers } from "@/hooks/familyMembers/use-get-all-family-members";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@prisma/client";

export default function FamilyMembersList() {
  const { data: familyMembers, isLoading } = useGetAllFamilyMembers();

  if (isLoading) {
    return <p>Carregando familiares...</p>;
  }

  if (!familyMembers || familyMembers.length === 0) {
    return null; 
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Lista Geral de Familiares</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Familiar</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Atirador Associado</TableHead>
                <TableHead className="text-right">Status do Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map((member: any) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.age || "N/A"}</TableCell>
                  <TableCell>{member.atirador?.name || "Não associado"}</TableCell>
                  <TableCell className="text-right">
                    {member.age < 6 ? (
                      <Badge variant="secondary">Isento</Badge>
                    ) : member.payment?.status === PaymentStatus.PAID ? (
                      <Badge className="bg-green-600 text-white hover:bg-green-700">
                        Pago
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Pendente</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}