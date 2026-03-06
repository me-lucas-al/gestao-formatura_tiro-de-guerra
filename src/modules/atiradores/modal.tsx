"use client";

import { useAtiradorModal } from "@/contexts/atirador-modal-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useTransition } from "react";
import { updateAtirador } from "@/actions/atiradores";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Need to fix imports or actions down the line for createAtirador. Currently building just edit functionality 
// since it was explicitly requested, but this serves as a good skeleton.

export default function AtiradorModal() {
    const { isModalOpen, modalMode, selectedAtirador, closeModal } = useAtiradorModal();

    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("PENDING");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (modalMode === "edit" && selectedAtirador) {
            setName(selectedAtirador.name || "");
            setNumber(selectedAtirador.number?.toString() || "");
            setPaymentStatus(selectedAtirador.payment?.status || "PENDING");
            setPaymentMethod(selectedAtirador.payment?.method || "CASH");
        } else {
            setName("");
            setNumber("");
            setPaymentStatus("PENDING");
            setPaymentMethod("CASH");
        }
    }, [modalMode, selectedAtirador]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            const paymentData = {
                status: paymentStatus,
                value: 0,
                method: paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID" ? paymentMethod : "CASH",
            };

            if (modalMode === "edit" && selectedAtirador) {
                const res = await updateAtirador(selectedAtirador.id, {
                    name,
                    number: parseInt(number),
                    payment: paymentData,
                });
                if (res.success) {
                    closeModal();
                } else {
                    console.error(res.error);
                }
            } else {
                // Placeholder for Create
                alert("Criar Atirador action not implemented in modal yet.");
                closeModal();
            }
        });
    };

    const showPaymentMethod = paymentStatus === "PAID" || paymentStatus === "FIRST_INSTALLMENT_PAID";

    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {modalMode === "create" ? "Adicionar Atirador" : "Editar Atirador"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                            id="number"
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Número do atiradores (ex: 01)"
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
                        <Button type="button" variant="outline" onClick={closeModal}>
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
