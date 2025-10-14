import api from "@/lib/axios/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAtirador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AtiradorCreateData;
    }) => {
      const response = await api.put(`/atiradores/${id}`, {
        ...data,
      });
      return response.data;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["atiradores"],
      });
    },
  });
}