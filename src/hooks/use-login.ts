import api from "@/lib/axios/client";
import { SignInData } from "@/schemas/login/sign-in";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInData) => {
      return api.post("/auth/login", data);
    },
    onSuccess: () => {
      router.push("/dashboard");
      toast.success("Login realizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao realizar o login.");
    }
  });
}