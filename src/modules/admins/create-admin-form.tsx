"use client";

import { useRef, useTransition, useState } from "react";
import { createAdmin, ActionResponse } from "@/actions/admins";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, ShieldCheck, FileKey } from "lucide-react";

export function CreateAdminForm() {
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<ActionResponse | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    setResponse(null);
    startTransition(async () => {
      const result = await createAdmin(formData);
      setResponse(result);

      if (result.success) {
        formRef.current?.reset();
      }
    });
  };

  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-800" />
          <h2 className="text-lg font-bold uppercase text-slate-900 tracking-tight">
            Cadastrar Novo Administrador
          </h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Instrução: Adicione os dados do novo administrador. A senha de primeiro
          acesso será configurada automaticamente.
        </p>
      </div>

      <div className="p-6">
        {response && !response.success && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">{response.error}</p>
              {response.fieldErrors && (
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {Object.entries(response.fieldErrors).map(([field, errors]) => (
                    <li key={field}>{errors.join(", ")}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {response && response.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium">{response.message}</p>
            </div>
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Sgt. Silva"
                required
                disabled={isPending}
                className="rounded-sm border-slate-300 focus-visible:ring-green-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">E-mail Institucional</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Ex: sgtsilva@tg02009.eb.mil.br"
                required
                disabled={isPending}
                className="rounded-sm border-slate-300 focus-visible:ring-green-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-700 font-medium">Nível de Permissão</Label>
            <Select name="role" required disabled={isPending} defaultValue="ADMIN">
              <SelectTrigger className="rounded-sm border-slate-300 focus:ring-green-800 w-full md:w-[50%]">
                <SelectValue placeholder="Selecione o Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador Padrão</SelectItem>
                <SelectItem value="SUPER_ADMIN">Administrador Chefe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileKey className="w-4 h-4 text-green-700" />
              <span>Senha de primeiro acesso será: <strong className="text-slate-700">admin123</strong></span>
            </div>
            
            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-800 hover:bg-green-900 text-white font-medium rounded-sm px-8"
            >
              {isPending ? "Processando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
