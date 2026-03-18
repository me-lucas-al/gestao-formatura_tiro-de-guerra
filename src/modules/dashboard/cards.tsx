"use client";

import {
  AtiradorWithRelations,
  FamilyMemberWithRelations,
} from "@packages/types";
import {
  Users,
  UserCheck,
  Clock,
  AlertTriangle,
  UsersRound,
  UserX,
  DollarSign,
} from "lucide-react";

export default function Cards({
  atiradores,
  familyMembers,
  totalArrecadado,
}: {
  atiradores: AtiradorWithRelations[];
  familyMembers: FamilyMemberWithRelations[];
  totalArrecadado: number;
}) {
  if (!atiradores) {
    return null;
  }

  const pagos = atiradores.filter((a) => a.payment?.status === "PAID").length;

  const totalAtiradores = atiradores.length;
  const totalFamilyMembers = familyMembers ? familyMembers.length : 0;
  const pendentes = atiradores.filter(
    (a) => a.payment?.status === "PENDING",
  ).length;
  const primeiraParcelaPaga = atiradores.filter(
    (a) => a.payment?.status === "FIRST_INSTALLMENT_PAID",
  ).length;

  const naoPagantes = familyMembers
    ? familyMembers.filter((fm) => fm.payment?.status === "ISENTO").length
    : 0;

  const cards = [
    {
      title: "Total de Atiradores",
      value: String(totalAtiradores),
      icon: Users,
      borderColor: "border-l-slate-600",
      textColor: "text-slate-900",
      iconColor: "text-slate-600",
    },
    {
      title: "Total de Familiares",
      value: String(totalFamilyMembers),
      icon: UsersRound,
      borderColor: "border-l-slate-600",
      textColor: "text-slate-900",
      iconColor: "text-slate-600",
    },
    {
      title: "Pagamentos Confirmados",
      value: String(pagos),
      icon: UserCheck,
      borderColor: "border-l-green-700",
      textColor: "text-green-700",
      iconColor: "text-green-700",
    },
    {
      title: "Primeira Parcela Paga",
      value: String(primeiraParcelaPaga),
      icon: Clock,
      borderColor: "border-l-amber-600",
      textColor: "text-amber-600",
      iconColor: "text-amber-600",
    },
    {
      title: "Pagamentos Pendentes",
      value: String(pendentes),
      icon: AlertTriangle,
      borderColor: "border-l-red-700",
      textColor: "text-red-700",
      iconColor: "text-red-700",
    },
    {
      title: "Isentos",
      value: String(naoPagantes),
      icon: UserX,
      borderColor: "border-l-purple-700",
      textColor: "text-purple-700",
      iconColor: "text-purple-700",
    },
    {
      title: "Total Arrecadado",
      value: `R$ ${totalArrecadado.toFixed(2)}`,
      icon: DollarSign,
      borderColor: "border-l-green-900",
      textColor: "text-green-900",
      iconColor: "text-green-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`bg-white rounded-sm border border-slate-200 border-l-4 ${card.borderColor} shadow-sm p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </h3>
              <Icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
