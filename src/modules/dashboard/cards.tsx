import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import { useGetAllFamilyMembers } from "@/hooks/familyMembers/use-get-all-family-members";
import { PaymentStatus } from "@prisma/client";

export default function Cards() {
  const { data: atiradores, isLoading } = useGetAllAtiradores();
  const { data: familyMembers } = useGetAllFamilyMembers();

  if (isLoading || !atiradores) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando dados dos atiradores...</p>
      </div>
    );
  }

  const pagos = atiradores.filter(
    (a: any) => a.payment?.status === PaymentStatus.PAID
  ).length;

  const totalAtiradores = atiradores.length;
  const totalFamilyMembers = familyMembers ? familyMembers.length : 0
  const pendentes = totalAtiradores - pagos;
  const primeiraParcelaPaga = atiradores.filter(
    (a: any) => a.payment?.status === PaymentStatus.FIRST_INSTALLMENT_PAID
  ).length;

  const criancasNaoPagantes = atiradores.filter(
    (a: any) =>
      a.familyMembers.some((fm: any) => fm.age < 6 && !fm.isPaid)
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
