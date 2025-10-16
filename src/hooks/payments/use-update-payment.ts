import api from "@/lib/axios/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CreatePaymentData } from "@/schemas/payment/create-payment-schema";

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreatePaymentData;
    }) => {
      const response = await api.put(`/payments/${id}`, {
        ...data,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
      toast.success("Pagamento atualizado com sucesso!");   
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar pagamento.");
      console.error(error)
    }
  });
}
