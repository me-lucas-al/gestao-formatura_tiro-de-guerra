"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtiradorWithRelations, FamilyMemberWithRelations } from "@packages/types";

export default function Cards({ atiradores, familyMembers }: { atiradores: AtiradorWithRelations[], familyMembers: FamilyMemberWithRelations[] }) {
  if (!atiradores) {
    return null;
  }

  const pagos = atiradores.filter(
    (a) => a.payment?.status === "PAID"
  ).length;

  const totalAtiradores = atiradores.length;
  const totalFamilyMembers = familyMembers ? familyMembers.length : 0;
  const pendentes = totalAtiradores - pagos;
  const primeiraParcelaPaga = atiradores.filter(
    (a) => a.payment?.status === "FIRST_INSTALLMENT_PAID"
  ).length;

  const criancasNaoPagantes = atiradores.filter(
    (a) =>
      a.familyMembers?.some((fm) => fm.age < 6 && fm.payment?.status !== "PAID")
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total de Atiradores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalAtiradores}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total de Familiares</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalFamilyMembers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Confirmados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{pagos}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Primeira Parcela Paga</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-yellow-600">{primeiraParcelaPaga}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{pendentes}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Crianças Não Pagantes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-600">{criancasNaoPagantes}</p>
        </CardContent>
      </Card>
    </div>
  );
}
