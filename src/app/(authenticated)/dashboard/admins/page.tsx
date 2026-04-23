import { CreateAdminForm } from "@/modules/admins/create-admin-form";
import { AdminList } from "@/modules/admins/admin-list";
import { AdminService } from "@/services/admin-service";
import { BackButton } from "@/components/back-button";
import Image from "next/image";
import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gestão de Administradores | Tiro de Guerra 02-009",
};

export default async function AdminsPage() {
  const auth = await requireAuth();
  if (!auth.success) {
    redirect("/dashboard");
  }

  const isSuperAdmin = auth.admin.role === "SUPER_ADMIN";
  const admins = await AdminService.getAdmins();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-8">
      <header className="border-b-2 border-green-900 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200">
              <Image src="/tg_logo_removed.png" alt="Logo TG" width={28} height={28} className="h-7 w-7 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-green-900 uppercase tracking-wider">
                Tiro de Guerra 02-009 — Braganca Paulista/SP
              </h1>
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                Gestao de Administradores
              </h2>
            </div>
          </div>
          <BackButton href="/dashboard" />
        </div>
        <p className="text-slate-600 max-w-2xl mt-2 text-sm">
          Modulo restrito. Adicione e gerencie os niveis de acesso ao sistema do
          TG 02-009. Todas as acoes sao registradas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5">
          <CreateAdminForm isSuperAdmin={isSuperAdmin} />
        </section>

        <section className="lg:col-span-7">
          <AdminList
            admins={admins}
            currentAdminId={auth.admin.id}
            isSuperAdmin={isSuperAdmin}
          />
        </section>
      </div>
    </div>
  );
}
