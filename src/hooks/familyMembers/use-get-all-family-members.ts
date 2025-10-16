import api from "@/lib/axios/client";
import { useQuery } from "@tanstack/react-query";

export function useGetAllFamilyMembers() {
  return useQuery({
    queryKey: ["family-members"],
    queryFn: async () => {
      const response = await api.get<FamilyMember[]>("/familyMembers/get-all");
      return response.data;
    },
    retry: false,
  });
}