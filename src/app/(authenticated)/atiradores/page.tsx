"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateAtirador } from "@/hooks/use-create-atirador";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllAdmins } from "@/hooks/admin/use-get-all-admins";
import { toast } from "react-toastify";
import { useState } from "react";

const formSchema = z.object({
  number: z.coerce
    .number()
    .min(1, { message: "O número deve ser no mínimo 1." })
    .max(100, { message: "O número deve ser no máximo 100." }),
  name: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  familyMemberQuantity: z.coerce.number().min(0, {
    message: "A quantidade de membros da família não pode ser negativa.",
  }),
  adminId: z.coerce.number().positive({ message: "Selecione um admin válido." }),
  isPaid: z.boolean().optional(),
  paymentValue: z.coerce
    .number()
    .positive({ message: "O valor do pagamento é obrigatório." })
    .optional(),
  paymentMethod: z
    .enum(["PIX", "CREDIT_CARD", "DEBIT_CARD", "CASH"])
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Atiradores() {
  const { data: admins, isLoading: isLoadingAdmins } = useGetAllAdmins();
  const { mutate: createAtirador, isPending } = useCreateAtirador();

  const [isPaidChecked, setIsPaidChecked] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    // 🔒 Só envia os detalhes de pagamento se estiver pago
    const payload = {
      ...data,
      isPaid: isPaidChecked,
      ...(isPaidChecked
        ? {
            paymentValue: data.paymentValue,
            paymentMethod: data.paymentMethod,
          }
        : {
            paymentValue: undefined,
            paymentMethod: undefined,
          }),
    };

    createAtirador(payload, {
      onSuccess: () => {
        reset();
        setIsPaidChecked(false);
        toast.success("Atirador adicionado com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao adicionar atirador.");
      },
    });
  };

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Adicionar Novo Atirador</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para registrar um novo atirador no sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* --- Dados do Atirador --- */}
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" type="number" {...register("number")} />
              {errors.number && (
                <p className="text-sm text-red-500">{errors.number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome de Guerra</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyMemberQuantity">
                Quantidade de Membros da Família
              </Label>
              <Input
                id="familyMemberQuantity"
                type="number"
                {...register("familyMemberQuantity")}
              />
              {errors.familyMemberQuantity && (
                <p className="text-sm text-red-500">
                  {errors.familyMemberQuantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminId">Admin Responsável</Label>
              <Controller
                name="adminId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um admin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingAdmins ? (
                        <SelectItem value="loading" disabled>
                          Carregando admins...
                        </SelectItem>
                      ) : (
                        admins?.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id.toString()}>
                            {admin.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.adminId && (
                <p className="text-sm text-red-500">
                  {errors.adminId.message}
                </p>
              )}
            </div>

            {/* --- Checkbox Pago --- */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Checkbox
                id="isPaid"
                checked={isPaidChecked}
                onCheckedChange={(checked: boolean) => setIsPaidChecked(!!checked)}
              />
              <Label htmlFor="isPaid">Pagamento realizado?</Label>
            </div>

            {/* --- Detalhes do Pagamento (só aparece se pago) --- */}
            {isPaidChecked && (
              <div className="border-t pt-6 space-y-6 animate-fade-in">
                <h3 className="text-lg font-medium">Detalhes do Pagamento</h3>

                <div className="space-y-2">
                  <Label htmlFor="paymentValue">Valor (R$)</Label>
                  <Input
                    id="paymentValue"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 50.00"
                    {...register("paymentValue")}
                  />
                  {errors.paymentValue && (
                    <p className="text-sm text-red-500">
                      {errors.paymentValue.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="CREDIT_CARD">
                            Cartão de Crédito
                          </SelectItem>
                          <SelectItem value="DEBIT_CARD">
                            Cartão de Débito
                          </SelectItem>
                          <SelectItem value="CASH">Dinheiro</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Adicionando..." : "Adicionar Atirador"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
