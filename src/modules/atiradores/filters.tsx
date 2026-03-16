"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Hash } from "lucide-react";

type AtiradorFiltersProps = {
  filters: { name: string; number: string; status: string };
  totalCount: number;
};

export function AtiradorFilters({ filters, totalCount }: AtiradorFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(filters.name);
  const [number, setNumber] = useState(filters.number);
  const debouncedName = useDebounce(name);
  const debouncedNumber = useDebounce(number);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "ALL") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    updateParams({ atirador_name: debouncedName });
  }, [debouncedName]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateParams({ atirador_number: debouncedNumber });
  }, [debouncedNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 border-b border-slate-200 bg-slate-50">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Pesquisar por nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9 rounded-sm border-slate-300 focus-visible:ring-green-800/50 focus-visible:border-green-800"
          />
        </div>
        <div className="relative w-full sm:w-36">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Número..."
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="pl-9 rounded-sm border-slate-300 focus-visible:ring-green-800/50 focus-visible:border-green-800"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(value) => updateParams({ atirador_status: value })}
        >
          <SelectTrigger className="w-full sm:w-48 rounded-sm border-slate-300 focus:ring-green-800">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="PAID">Pago</SelectItem>
            <SelectItem value="FIRST_INSTALLMENT_PAID">
              1a Parcela Paga
            </SelectItem>
            <SelectItem value="CANCELED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">
        {totalCount} atirador(es) encontrado(s)
      </p>
    </div>
  );
}
