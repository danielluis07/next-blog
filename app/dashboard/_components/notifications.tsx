"use client";

import { CiBellOn } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNotifications } from "@/queries/get-notifications";
import { useDeleteNotifications } from "@/queries/use-delete-notifications";
import { cn } from "@/lib/utils";
import { MoonLoader } from "react-spinners";
import { NotificationDiv } from "@/app/dashboard/_components/notification-div";
import { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { FaComment } from "react-icons/fa";
import { pusherClient } from "@/lib/pusherClient";
import { useUpdateNotifications } from "@/queries/use-update-notifications";

export const Notifications = () => {
  const notificationsQuery = getNotifications();
  const notifications = notificationsQuery.data || [];
  const deleteNotifications = useDeleteNotifications();
  const updateNotifications = useUpdateNotifications();

  const handleMarkAllAsRead = () => {
    updateNotifications.mutate({ ids: notifications.map((n) => n.id) });
  };

  const handleDeleteAll = () => {
    deleteNotifications.mutate({ ids: notifications.map((n) => n.id) });
  };

  useEffect(() => {
    pusherClient.subscribe("notifications");
    const newLike = (data: any) => {
      toast.success(data.message, {
        icon: <FaHeart />,
      });
      notificationsQuery.refetch();
    };

    const newComment = (data: any) => {
      toast.success(data.message, {
        icon: <FaComment />,
      });
      notificationsQuery.refetch();
    };

    const newUser = (data: any) => {
      toast.success(data.message, {
        icon: <FaUser />,
      });
      notificationsQuery.refetch();
    };

    pusherClient.bind("likes:new", newLike);
    pusherClient.bind("comments:new", newComment);
    pusherClient.bind("users:new", newUser);

    return () => {
      pusherClient.unbind("likes:new");
      pusherClient.unbind("comments:new");
      pusherClient.unbind("users:new");

      pusherClient.unsubscribe("notifications");
    };
  }, []);

  return (
    <Popover onOpenChange={handleMarkAllAsRead}>
      <PopoverTrigger asChild>
        <div className="relative">
          <CiBellOn className="cursor-pointer text-gray-500" size={24} />
          <span
            className={cn(
              notificationsQuery.isLoading
                ? "hidden"
                : "absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full"
            )}>
            {notifications.filter((notification) => !notification.viewed)
              .length > 9
              ? "9+"
              : notifications.filter((notification) => !notification.viewed)
                  .length}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        {notificationsQuery.isLoading ? (
          <div className="flex justify-center items-center h-52">
            <MoonLoader size={24} color="#fff" />
          </div>
        ) : (
          <div className="w-full">
            <div className="p-3 flex justify-between items-center border-b border-border">
              <span className="text-sm font-semibold">Notificações</span>
            </div>
            <ul className="divide-y divide-gray-200">
              {notifications.length > 0 ? (
                notifications
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || 0).getTime() -
                      new Date(a.createdAt || 0).getTime()
                  )
                  .map((notification, index) => (
                    <NotificationDiv
                      key={index}
                      id={notification.id}
                      index={index}
                      message={notification.message}
                      type={notification.type}
                    />
                  ))
              ) : (
                <li className="p-3 text-center text-gray-500">
                  Nenhuma notificação
                </li>
              )}
            </ul>
            {notifications.length > 0 && (
              <div className="p-3 flex justify-between items-center border-t border-border">
                <span className="text-gray-400 text-sm">Deletar todas</span>
                <button onClick={handleDeleteAll} className="ml-2">
                  <FaRegTrashAlt className="text-gray-400 hover:text-red-500 text-sm" />
                </button>
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
