import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.protected.notifications)["notifications-viewed"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.protected.notifications)["notifications-viewed"]["$patch"]
>["json"];

type Notification = {
  id: string;
  viewed: boolean;
};

type MutationContext = {
  previousNotifications: Notification[] | undefined;
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType,
    MutationContext
  >({
    mutationFn: async (json) => {
      const res = await client.api.protected.notifications[
        "notifications-viewed"
      ]["$patch"]({
        json,
      });
      return await res.json();
    },
    onMutate: async (updatedNotification) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
      ]);

      queryClient.setQueryData<Notification[] | undefined>(
        ["notifications"],
        (old) => {
          if (!old) return [];
          return old.map((notification) =>
            updatedNotification.ids.includes(notification.id)
              ? { ...notification, viewed: true }
              : notification
          );
        }
      );

      return { previousNotifications };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["notifications"],
        context?.previousNotifications
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return mutation;
};
