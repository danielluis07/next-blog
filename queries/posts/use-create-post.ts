import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.protected.posts.$post>;
type RequestType = InferRequestType<
  typeof client.api.protected.posts.$post
>["json"];

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.protected.posts.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Post criado!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Houve um erro ao criar o post!");
    },
  });

  return mutation;
};
