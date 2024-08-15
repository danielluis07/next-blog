"use client";

import { getUsers } from "@/queries/users/get-users";
import { UsersDataTable } from "./users-table";
import { columns } from "./users-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useDeleteCategories } from "@/queries/categories/use-delete-categories";

export const UsersClient = () => {
  const usersQuery = getUsers();
  const users = usersQuery.data || [];
  const deleteCategories = useDeleteCategories();
  const disabled = deleteCategories.isPending;

  if (usersQuery.isLoading) {
    return (
      <Card className="size-full px-2 pt-2">
        <div className="space-y-3">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-[420px] h-12" />
        </div>
        <div className="mt-8 border border-gray-300 rounded-lg p-3">
          <div className="flex border-b pb-2">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="w-24 h-5 ml-32" />
          </div>
          <div className="mt-8 space-y-5">
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex pb-2">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="size-full px-2 pt-2">
      <h1 className="text-xl font-bold">Usuários</h1>
      <UsersDataTable
        columns={columns}
        data={users}
        disabled={disabled}
        searchKey="name"
      />
    </Card>
  );
};
