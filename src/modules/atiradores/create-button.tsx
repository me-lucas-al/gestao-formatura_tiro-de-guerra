"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { createAtirador } from "@/actions/atiradores";

export default function CreateAtiradorButton() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("PENDING");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const paymentData = {
                status: paymentStatus as "PENDING" | "PAID" | "FIRST_INSTALLMENT_PAID" | "CANCELED",
                value: 0,
                method: (paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID" ? paymentMethod : "CASH") as "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PIX",
            };

            const res = await createAtirador({
                name,
                number: parseInt(number),
                payment: paymentData,
            });
            if (res.success) {
                setOpen(false);
                setName("");
                setNumber("");
                setPaymentStatus("PENDING");
                setPaymentMethod("CASH");
            } else {
                console.error(res.error);
            }
        });
    };

    const showPaymentMethod = paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Atirador
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Atirador</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                            id="number"
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Número do atirador (ex: 01)"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome do atirador"
                            required
                        />
                    </div>

                    <div>
                        <Label>Status do Pagamento</Label>
                        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="PAID">Pago</SelectItem>
                                <SelectItem value="FIRST_INSTALLMENT_PAID">Primeira Parcela Paga</SelectItem>
                                <SelectItem value="CANCELED">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {showPaymentMethod && (
                        <div>
                            <Label>Método de Pagamento</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o método" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">Dinheiro</SelectItem>
                                    <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                                    <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                                    <SelectItem value="PIX">PIX</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
