"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getTotalUsers } from "@/queries/users/get-total-users";

export const TotalUsers = () => {
  const usersCountQuery = getTotalUsers();

  if (usersCountQuery.isLoading) {
    return <Skeleton className="size-40" />;
  }

  return (
    <div className="flex justify-center items-center size-40 rounded-md shadow-md p-4">
      <div className="flex flex-col">
        <span className="text-xl">Total de Usuários</span>
        <span className="text-3xl">{usersCountQuery.data}</span>
      </div>
    </div>
  );
};
