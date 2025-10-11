import api from "@/lib/axios/client";
import { useQuery } from "@tanstack/react-query";

export function useGetAllAdmins() {
  return useQuery({
    queryKey: ["admin-list"],
    queryFn: async () => {
      const response = await api.get<Admin[]>("/admin/get-all");
      return response.data;
    },
    retry: false,
  });
}