import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.protected.notifications)["notification-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.protected.notifications)["notification-delete"]["$post"]
>["json"];

type Notification = {
  ids: string;
};

type MutationContext = {
  previousNotifications: Notification[] | undefined;
};

export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType, MutationContext>({
    mutationFn: async (json) => {
      const res = await client.api.protected.notifications[
        "notification-delete"
      ]["$post"]({
        json,
      });
      return await res.json();
    },
    onMutate: async (deletedNotification) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
      ]);

      queryClient.setQueryData<Notification[] | undefined>(
        ["notifications"],
        (old) => {
          if (!old) return [];
          return old.filter(
            (notification) =>
              !deletedNotification.ids.includes(notification.ids)
          );
        }
      );

      return { previousNotifications };
    },
    onSuccess: () => {
      toast.success("Notificações deletadas");
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["notifications"],
        context?.previousNotifications
      );
      toast.error("Falha ao deletar as notificações!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
