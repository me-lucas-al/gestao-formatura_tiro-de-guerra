import api from "@/lib/axios/client";
import { CreateFamilyMemberData } from "@/schemas/login/create-family-member-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFamilyMemberById() {
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
