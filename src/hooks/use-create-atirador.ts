import api from "@/lib/axios/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useCreateAtirador() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: Pick<Atirador, "name" | "familyMemberQuantity" | "number" | "adminId">) => {
      return api.post("/admin/create-atiradores", data);
    },
    onSuccess: () => {
      router.push("/dashboard");
      toast.success("Atirador adicionado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao adicionar o atirador.");
    }
  });
}