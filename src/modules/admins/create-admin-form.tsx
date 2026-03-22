"use client";

import { useRef, useTransition } from "react";
import { createAdmin } from "@/actions/admins";
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
import { ShieldCheck, FileKey } from "lucide-react";
import { toast } from "sonner";

interface CreateAdminFormProps {
  isSuperAdmin: boolean;
}

export function CreateAdminForm({ isSuperAdmin }: CreateAdminFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createAdmin(formData);

      if (result.success) {
        toast.success(
          result.message ??
            "Administrador criado com sucesso! Senha padrão: admin123",
        );
        formRef.current?.reset();
      } else {
        const fieldMsg = result.fieldErrors
          ? Object.values(result.fieldErrors).flat().join(", ")
          : null;
        toast.error(fieldMsg ?? result.error ?? "Erro ao criar administrador.");
      }
    });
  };

  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-green-900 px-6 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-white" />
          <h2 className="text-lg font-bold uppercase text-white tracking-wider">
            Cadastrar Novo Administrador
          </h2>
        </div>
        <p className="text-sm text-green-100/80 mt-1">
          Instrucao: Adicione os dados do novo administrador. A senha de
          primeiro acesso sera configurada automaticamente.
        </p>
      </div>

      <div className="p-6">
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-700 font-medium text-sm uppercase tracking-wide"
              >
                Usuário
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Sgt. Silva"
                required
                disabled={isPending}
                className="rounded-sm border-slate-300 focus-visible:ring-green-800"
              />
            </div>
          </div>

          {isSuperAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-slate-700 font-medium text-sm uppercase tracking-wide"
                >
                  Nivel de Permissao
                </Label>
                <Select
                  name="role"
                  required
                  disabled={isPending}
                  defaultValue="ADMIN"
                >
                  <SelectTrigger className="rounded-sm border-slate-300 focus:ring-green-800 w-full">
                    <SelectValue placeholder="Selecione o Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador Padrão</SelectItem>
                    <SelectItem value="SUPER_ADMIN">
                      Administrador Chefe
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="year"
                  className="text-slate-700 font-medium text-sm uppercase tracking-wide"
                >
                  Ano de Servico
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="2020"
                  max="2100"
                  defaultValue={new Date().getFullYear()}
                  required
                  disabled={isPending}
                  className="rounded-sm border-slate-300 focus-visible:ring-green-800 w-full"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileKey className="w-4 h-4 text-green-700" />
              <span>
                Senha de primeiro acesso será:{" "}
                <strong className="text-slate-700">admin123</strong>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-900 hover:bg-green-800 text-white font-semibold rounded-sm px-8 uppercase tracking-wider"
            >
              {isPending ? "Processando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
