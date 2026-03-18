"use client";

import { useState, useTransition } from "react";
import { AdminEntity } from "@/schemas/admin";
import { Shield, Calendar, UserIcon, KeyRound, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { changeAdminPassword, deleteAdmin } from "@/actions/admins";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

interface AdminListProps {
  admins: AdminEntity[];
  currentAdminId: number;
  isSuperAdmin: boolean;
}

export function AdminList({ admins, currentAdminId, isSuperAdmin }: AdminListProps) {
  const { confirm } = useConfirm();
  const [isPending, startTransition] = useTransition();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [targetAdmin, setTargetAdmin] = useState<AdminEntity | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const openPasswordDialog = (admin: AdminEntity) => {
    setTargetAdmin(admin);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordDialogOpen(true);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAdmin) return;

    startTransition(async () => {
      const result = await changeAdminPassword(targetAdmin.id, newPassword, confirmPassword);
      if (result.success) {
        toast.success(result.message ?? "Senha alterada com sucesso.");
        setPasswordDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error ?? "Erro ao alterar senha.");
      }
    });
  };

  const handleDelete = (admin: AdminEntity) => {
    startTransition(async () => {
      const ok = await confirm({
        title: "Remover Administrador",
        description: `Tem certeza que deseja remover o administrador "${admin.name}"?\nEsta ação não pode ser desfeita.`,
        confirmText: "Remover",
        cancelText: "Cancelar",
      });
      if (!ok) return;
      const result = await deleteAdmin(admin.id);
      if (result.success) {
        toast.success(result.message ?? "Administrador removido.");
      } else {
        toast.error(result.error ?? "Erro ao remover administrador.");
      }
    });
  };

  if (admins.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-sm">
        <Shield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">
          Nenhum administrador encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-green-900 px-6 py-4">
          <h2 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Efetivo Administrativo
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {admins.map((admin) => {
            const isOwn = admin.id === currentAdminId;
            const canChangePassword = isSuperAdmin || isOwn;
            const canDelete = isSuperAdmin && !isOwn;

            return (
              <div
                key={admin.id}
                className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 uppercase tracking-wide text-sm">
                      {admin.name}
                      {isOwn && (
                        <span className="ml-2 text-xs font-normal text-slate-400 normal-case tracking-normal">
                          (você)
                        </span>
                      )}
                    </h3>
                    {admin.role === "SUPER_ADMIN" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold bg-green-900 text-white uppercase tracking-wider">
                        Chefe
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold bg-slate-200 text-slate-700 uppercase tracking-wider">
                        Padrao
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    {admin.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        {admin.email}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Ano: {admin.year}
                    </div>
                    <div className="text-xs text-slate-400">
                      Cadastrado em: {new Date(admin.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canChangePassword && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm text-xs"
                      onClick={() => openPasswordDialog(admin)}
                      disabled={isPending}
                    >
                      <KeyRound className="h-3 w-3 mr-1" />
                      Mudar Senha
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(admin)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal — Mudar Senha */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="rounded-sm max-w-md">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider text-sm font-bold text-slate-900">
              Alterar Senha — {targetAdmin?.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Nova Senha
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isPending}
                className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Confirmar Nova Senha
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
                disabled={isPending}
                className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-sm text-xs"
                onClick={() => setPasswordDialogOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-900 hover:bg-green-800 text-white rounded-sm text-xs uppercase tracking-wider font-semibold"
              >
                {isPending ? "Salvando..." : "Salvar Senha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
