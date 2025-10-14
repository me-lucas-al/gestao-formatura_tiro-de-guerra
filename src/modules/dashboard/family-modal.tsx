// src/modules/dashboard/family-modal.tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { toast } from "react-toastify";

import { useCreateFamilyMember } from "@/hooks/familyMembers/use-create-family-member";
import { useUpdateFamilyMember } from "@/hooks/familyMembers/use-update-family-member";

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

const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  CASH: "Dinheiro",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  FIRST_INSTALLMENT_PAID: "1ª Parcela Paga",
};

const formSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório."),
  age: z.coerce.number().positive("A idade é obrigatória.").max(100),
  payment: z.object({
    value: z.coerce.number(),
    method: z.nativeEnum(PaymentMethod).nullable(),
    status: z.nativeEnum(PaymentStatus),
  }),
}).superRefine((data, ctx) => {
    if (data.age >= 6) {
      if (data.payment.value <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "O valor deve ser positivo.",
          path: ["payment.value"],
        });
      }
      if (!data.payment.method) {
        ctx.addIssue({
          code: "custom",
          message: "Selecione um método de pagamento.",
          path: ["payment.method"],
        });
      }
    }
});

type FormData = z.infer<typeof formSchema>;

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  atiradorId?: number | null;
  familyMemberData?: any | null;
}

export default function FamilyMemberModal({
  isOpen,
  onClose,
  mode,
  atiradorId,
  familyMemberData,
}: FamilyMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      payment: {
        value: 0,
        method: null,
        status: PaymentStatus.PENDING,
      }
    }
  });

  const { mutate: createMutation, isPending: isCreating } = useCreateFamilyMember();
  const { mutate: updateMutation, isPending: isUpdating } = useUpdateFamilyMember();

  const age = watch("age");
  const isPaymentDisabled = age < 6;
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (isPaymentDisabled) {
      setValue("payment.value", 0);
      setValue("payment.method", null);
      setValue("payment.status", PaymentStatus.PENDING);
    }
  }, [isPaymentDisabled, setValue]);

  useEffect(() => {
    if (isOpen && mode === "edit" && familyMemberData) {
      setValue("name", familyMemberData.name);
      setValue("age", familyMemberData.age);
      setValue("payment.value", familyMemberData.payment?.value || 0);
      setValue("payment.method", familyMemberData.payment?.method || null);
      setValue("payment.status", familyMemberData.payment?.status || PaymentStatus.PENDING);
    } else {
      reset();
    }
  }, [isOpen, mode, familyMemberData, setValue, reset]);

  const handleSuccess = (message: string) => {
    toast.success(message);
    onClose();
  };

  const handleError = (error: any, fallback: string) => {
    toast.error(error?.response?.data?.message || fallback);
  };

  const onSubmit = (data: FormData) => {
    if (mode === "create" && !atiradorId) return;

    const finalData = {
        name: data.name,
        age: data.age,
        atiradorId: atiradorId,
        payment: {
            value: isPaymentDisabled ? 0 : data.payment.value,
            method: isPaymentDisabled ? PaymentMethod.CASH : data.payment.method!,
            status: isPaymentDisabled ? PaymentStatus.PAID : data.payment.status,
        }
    };
    
    if (mode === "create") {
      createMutation(finalData, {
        onSuccess: () => handleSuccess("Familiar adicionado com sucesso!"),
        onError: (error) => handleError(error, "Erro ao adicionar familiar."),
      });
    } else if (mode === "edit" && familyMemberData) {
      updateMutation(
        { id: familyMemberData.id, data: finalData },
        {
          onSuccess: () => handleSuccess("Familiar atualizado com sucesso!"),
          onError: (error) => handleError(error, "Erro ao atualizar familiar."),
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar Novo Familiar" : `Editar Familiar`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="age">Idade</Label>
            <Input id="age" type="number" {...register("age")} />
            {age > 0 && age < 6 && (
              <p className="text-blue-600 text-sm mt-1">Menores de 6 anos não pagam.</p>
            )}
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </div>

          <fieldset disabled={isPaymentDisabled} className="space-y-4">
            <div>
              <Label htmlFor="paymentValue">Valor do Pagamento (R$)</Label>
              <Input id="paymentValue" type="number" step="0.01" {...register("payment.value")} />
              {errors.payment?.value && (
                <p className="text-red-500 text-sm mt-1">{errors.payment.value.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Select
                onValueChange={(value) => setValue("payment.method", value as PaymentMethod)}
                defaultValue={familyMemberData?.payment?.method}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((method) => (
                    <SelectItem key={method} value={method}>
                      {paymentMethodLabels[method]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payment?.method && (
                <p className="text-red-500 text-sm mt-1">{errors.payment.method.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status de Pagamento</Label>
               <Select
                onValueChange={(value) => setValue("payment.status", value as PaymentStatus)}
                defaultValue={familyMemberData?.payment?.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {paymentStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payment?.status && (
                <p className="text-red-500 text-sm mt-1">{errors.payment.status.message}</p>
              )}
            </div>
          </fieldset>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}