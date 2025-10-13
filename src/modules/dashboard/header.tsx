import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatus } from "@prisma/client";
import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import { useSession } from "@/hooks/use-session";

export default function DashboardHeader() {
  const { admin } = useSession();
  const { data: atiradores, isLoading } = useGetAllAtiradores();
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
  const totalFamilyMembers = atiradores.reduce((acc: number, atirador: any) => acc + atirador.familyMembers.length, 0);
  const pendentes = totalAtiradores - pagos;
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
            Bem-vindo, {admin?.name
                ?.split('_')
                .join(' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            }!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            <CardTitle>Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendentes}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
