"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => (href ? router.push(href) : router.back())}
      className="rounded-sm font-semibold uppercase tracking-wider text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Voltar
    </Button>
  );
}
