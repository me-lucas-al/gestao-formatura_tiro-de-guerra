import api from "@/lib/axios/client";
import { CreateFamilyMemberData } from "@/schemas/family-members/create-family-member-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useCreateFamilyMember() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateFamilyMemberData) => {
      return api.post("/familyMembers", data);
    },
    onSuccess: () => {
      router.push("/dashboard");
      toast.success("Membro da família criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar o membro da família.");
    },
  });
}
