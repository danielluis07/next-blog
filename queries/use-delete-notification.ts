import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.protected.notifications)[":id"]["$delete"]
>;

type Notification = {
  id: string;
};

type MutationContext = {
  previousNotifications: Notification[] | undefined;
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, string, MutationContext>({
    mutationFn: async (id: string) => {
      const res = await client.api.protected.notifications[":id"]["$delete"]({
        param: { id },
      });
      return await res.json();
    },
    onMutate: async (deletedNotificationId) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
      ]);

      queryClient.setQueryData<Notification[] | undefined>(
        ["notifications"],
        (old) => {
          if (!old) return [];
          return old.filter(
            (notification) => notification.id !== deletedNotificationId
          );
        }
      );

      return { previousNotifications };
    },
    onSuccess: () => {
      toast.success("Notificação deletada!");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err, deletedNotificationId, context) => {
      if (context) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }
      toast.error("Falhou ao deletar notificação!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
