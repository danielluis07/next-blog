import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)["category-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)["category-delete"]["$post"]
>["json"];

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.categories["category-delete"]["$post"]({
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Categoria deletada!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Houve um erro ao deletar as categorias!");
    },
  });

  return mutation;
};
