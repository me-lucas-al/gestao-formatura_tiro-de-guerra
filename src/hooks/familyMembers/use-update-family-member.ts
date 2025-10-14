import api from "@/lib/axios/client";
import { CreateFamilyMemberData } from "@/schemas/family-members/create-family-member-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateFamilyMemberData;
    }) => {
      const response = await api.put(`/familyMembers/${id}`, {
        ...data,
      });
      return response.data;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sectors"],
      });
    },
  });
}
