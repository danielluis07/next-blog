"use client";

import { useDeleteNotification } from "@/queries/use-delete-notification";
import { FaComment, FaHeart, FaRegTrashAlt, FaUser } from "react-icons/fa";

type NotificationDivProps = {
  id: string;
  index: number;
  message: string;
  type: string;
};

export const NotificationDiv = ({
  id,
  index,
  message,
  type,
}: NotificationDivProps) => {
  const deleteNotification = useDeleteNotification();

  const handleDelete = () => {
    deleteNotification.mutate(id);
  };

  return (
    <div key={index} className="p-3 flex justify-between items-center">
      {type === "NEW_USER" && (
        <FaUser className="text-blue-500 hover:text-gray-500 text-sm" />
      )}
      {type === "NEW_COMMENT" && (
        <FaComment className="text-gray-500 hover:text-gray-500 text-sm" />
      )}
      {type === "NEW_LIKE" && (
        <FaHeart className="text-red-500 hover:text-gray-500 text-sm" />
      )}

      <span className="text-sm">{message}</span>
      <button onClick={handleDelete}>
        <FaRegTrashAlt className="text-gray-400 hover:text-red-500 text-sm" />
      </button>
    </div>
  );
};
