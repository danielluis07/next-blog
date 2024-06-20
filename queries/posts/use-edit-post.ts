import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.protected.posts)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.protected.posts)[":id"]["$patch"]
>["json"];

export const useEditPost = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.protected.posts[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Post editado!");
      queryClient.invalidateQueries({ queryKey: ["post", { id }] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postCategories"] });
    },
    onError: () => {
      toast.error("Houve um erro editar o post!");
    },
  });

  return mutation;
};
