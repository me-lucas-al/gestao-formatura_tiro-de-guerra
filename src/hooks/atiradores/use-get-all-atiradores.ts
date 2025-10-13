import api from "@/lib/axios/client";
import { useQuery } from "@tanstack/react-query";

export function useGetAllAtiradores() {
  return useQuery({
    queryKey: ["atiradores-list"],
    queryFn: async () => {
      const response = await api.get<Atirador[]>("/atiradores/get-all");
      return response.data;
    },
    retry: false,
  });
}