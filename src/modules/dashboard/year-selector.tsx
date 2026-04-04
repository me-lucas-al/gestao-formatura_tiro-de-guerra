"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setActiveYear } from "@/actions/year";
import { useRouter } from "next/navigation";

export function YearSelector({
  availableYears,
  currentYear,
}: {
  availableYears: number[];
  currentYear: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleYearChange = (year: string) => {
    startTransition(async () => {
      await setActiveYear(Number(year));
      router.refresh();
    });
  };

  if (availableYears.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-green-900 uppercase tracking-wider">
        Turma:
      </span>
      <Select
        defaultValue={currentYear.toString()}
        onValueChange={handleYearChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[100px] h-8 text-xs border-green-900 text-green-900 font-bold bg-white focus:ring-green-900/20">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
