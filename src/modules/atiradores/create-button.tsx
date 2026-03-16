"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { AlertCircle, PlusCircle } from "lucide-react";
import { createAtirador } from "@/actions/atiradores";
import { toast } from "sonner";

export default function CreateAtiradorButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentValue, setPaymentValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const paymentData = {
        status: paymentStatus as
          | "PENDING"
          | "PAID"
          | "FIRST_INSTALLMENT_PAID"
          | "CANCELED",
        value: parseFloat(paymentValue) || 0,
        method: (paymentStatus === "PAID" ||
        paymentStatus === "FIRST_INSTALLMENT_PAID"
          ? paymentMethod
          : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
      };
      const res = await createAtirador({
        name,
        number: parseInt(number),
        payment: paymentData,
      });
      if (res.success) {
        toast.success("Atirador adicionado com sucesso.");
        setOpen(false);
        setName("");
        setNumber("");
        setPaymentStatus("PENDING");
        setPaymentMethod("CASH");
        setPaymentValue("");
        setError("");
      } else if (res.error?.includes("número")) {
        // Duplicate number — keep inline in the modal
        setError(res.error);
      } else {
        toast.error(res.error ?? "Erro ao criar atirador.");
      }
    });
  };

  const showPaymentMethod =
    paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID";

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-white text-green-900 hover:bg-green-50 border border-green-200 rounded-sm font-semibold uppercase tracking-wider text-xs"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar Atirador
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setError(""); }}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider text-slate-900">
              Adicionar Atirador
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Numero
              </Label>
              <Input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Numero do atirador (ex: 01)"
                required
                min="1"
                className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Nome
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do atirador"
                required
                className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status do Pagamento
              </Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="rounded-sm border-slate-300">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PAID">Pago</SelectItem>
                  <SelectItem value="FIRST_INSTALLMENT_PAID">
                    Primeira Parcela Paga
                  </SelectItem>
                  <SelectItem value="CANCELED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showPaymentMethod && (
              <>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Metodo de Pagamento
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="rounded-sm border-slate-300">
                      <SelectValue placeholder="Selecione o metodo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">
                        Cartao de Credito
                      </SelectItem>
                      <SelectItem value="DEBIT_CARD">Cartao de Debito</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Valor do Pagamento (R$)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentValue}
                    onChange={(e) => setPaymentValue(e.target.value)}
                    placeholder="0.00"
                    className="rounded-sm border-slate-300 focus-visible:ring-green-800/50"
                  />
                </div>
              </>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-sm"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-900 hover:bg-green-800 rounded-sm uppercase tracking-wider font-semibold"
              >
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
