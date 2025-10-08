// src/app/(authenticated)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const data = await apiGet("/api/admin/get-admin");
        if (data && !data.error) {
          setAdminData(data);
        } else {
          setError(data.error || "Falha ao carregar os dados.");
        }
      } catch (err) {
        setError("Erro ao se conectar ao servidor.");
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Bem-vindo, {adminData?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Atiradores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{adminData?.atiradores.length || 0}</p>
          </CardContent>
        </Card>
        {/* Aqui você pode adicionar mais cards com outras estatísticas */}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Lista de Atiradores</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membros da Família</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pagamento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminData?.atiradores.map((atirador) => (
                    <tr key={atirador.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{atirador.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{atirador.familyMemberQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Lógica simples para verificar o pagamento */}
                        {atirador.payments.some(p => p.isPaid) ? (
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
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}