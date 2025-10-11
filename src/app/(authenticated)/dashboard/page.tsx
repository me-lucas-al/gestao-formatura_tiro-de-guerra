"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetAllAdmins } from "@/hooks/admin/use-get-all-admins";

export default function Dashboard() {
  const { admin } = useSession();
  const { data: admins, isLoading } = useGetAllAdmins();
  console.log(admins);
  if (isLoading || !admins) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bem-vindo, {admin?.name}!</h1>

        <Link href="/atiradores">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Adicionar Atirador
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Atiradores que já pagaram</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {
          admins
            .flatMap(admin => admin.atiradores)
            .filter(atirador => atirador.payments?.some(payment => payment.isPaid))
            .length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Lista de Atiradores</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membros da Família
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Pagamento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 
                  {admin.atiradores.map((atirador) => (
                    <tr key={atirador.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{atirador.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{atirador.familyMemberQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {atirador.payments.some((p) => p.isPaid) ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Pago
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))} 
                  */}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
