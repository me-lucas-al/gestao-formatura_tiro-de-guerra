import api from "@/lib/axios/client";
import { useQuery } from "@tanstack/react-query";

export function useGetAdmin() {
  return useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const response = await api.get<Admin>("/admin/session");
      return response.data;
    },
    retry: false,
  });
}