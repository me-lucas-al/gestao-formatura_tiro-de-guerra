import { AdminEntity } from "@/schemas/admin";
import { Shield, Mail, Calendar, UserIcon } from "lucide-react";

export function AdminList({ admins }: { admins: AdminEntity[] }) {
  if (admins.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-sm">
        <Shield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">Nenhum administrador encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-bold uppercase text-slate-900 tracking-tight flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-slate-700" />
          Administradores Cadastrados
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {admins.map((admin) => (
          <div key={admin.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{admin.name}</h3>
                {admin.role === "SUPER_ADMIN" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Chefe
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                    Padrão
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {admin.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {admin.createdAt.toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
