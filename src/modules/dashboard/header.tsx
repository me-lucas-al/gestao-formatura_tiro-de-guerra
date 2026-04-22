"use client";

import { useSession } from "@/hooks/use-session";
import Cards from "./cards";
import {
  AtiradorWithRelations,
  FamilyMemberWithRelations,
} from "@packages/types";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/login";
import { YearSelector } from "./year-selector";

export default function DashboardHeader({
  atiradores,
  familyMembers,
  totalArrecadado,
  availableYears,
}: {
  atiradores: AtiradorWithRelations[];
  familyMembers: FamilyMemberWithRelations[];
  totalArrecadado: number;
  availableYears?: number[];
}) {
  const { admin } = useSession();

  const formatName = (name?: string) => {
    if (!name) return "";
    return name
      .split("_")
      .join(" ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <header className="border-b-2 border-green-900 pb-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-900 p-2 rounded-sm text-white">
              <Image src="/tg_logotipo.png" alt="Logo TG" width={24} height={24} className="h-6 w-6 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-green-900 uppercase tracking-wider">
                Tiro de Guerra 02-009 — Braganca Paulista/SP
              </h1>
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                Painel de Controle
              </h2>
            </div>
          </div>

          {!!admin && (
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admins">
                <Button className="bg-green-900 hover:bg-green-800 text-white rounded-sm font-semibold uppercase tracking-wider text-xs">
                  <Settings className="h-4 w-4 mr-2" />
                  Gerenciar Admins
                </Button>
              </Link>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-sm font-semibold uppercase tracking-wider text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </form>
            </div>
          )}
        </div>
        <p className="text-slate-600 text-sm mt-2">
          Bem-vindo(a),{" "}
          <span className="font-semibold text-slate-900">
            {formatName(admin?.name)}
          </span>
          . Gerencie atiradores, familiares e pagamentos da formatura.
        </p>

        {admin?.role === "SUPER_ADMIN" &&
          !!availableYears &&
          availableYears.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-sm inline-flex items-center gap-4">
              <YearSelector
                availableYears={availableYears}
                currentYear={admin.activeYear ?? new Date().getFullYear()}
              />
              <p className="text-xs text-green-800 italic">
                * Você está visualizando os dados da turma selecionada.
              </p>
            </div>
          )}
      </header>

      <Cards
        atiradores={atiradores}
        familyMembers={familyMembers}
        totalArrecadado={totalArrecadado}
      />
    </>
  );
}
