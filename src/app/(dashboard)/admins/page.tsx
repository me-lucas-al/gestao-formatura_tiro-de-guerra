import { CreateAdminForm } from "@/modules/admins/create-admin-form";
import { AdminList } from "@/modules/admins/admin-list";
import { AdminService } from "@/services/admin-service";
import { Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestão de Administradores | Tiro de Guerra 02-009",
};

export default async function AdminsPage() {
  // RSC fetching the data directly from the Service
  const admins = await AdminService.getAdmins();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-8">
      {/* Header with Military Identity */}
      <header className="border-b-2 border-green-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-800 p-2 rounded-sm text-white">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-green-800 uppercase tracking-wider">
              Tiro de Guerra 02-009 - Bragança Paulista/SP
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 uppercase">
              Gestão de Administradores
            </h2>
          </div>
        </div>
        <p className="text-slate-600 max-w-2xl mt-2 text-sm">
          Módulo restrito. Adicione e gerencie os níveis de acesso ao sistema do TG 02-009. 
          Todas as ações são registradas.
        </p>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Create Form */}
        <section className="lg:col-span-5">
          <CreateAdminForm />
        </section>

        {/* Right Side: List of current Admins */}
        <section className="lg:col-span-7">
          <AdminList admins={admins} />
        </section>
      </div>
    </div>
  );
}
