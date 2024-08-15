"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getTotalComments } from "@/queries/get-total-comments";

export const TotalComments = () => {
  const totalCommentsQuery = getTotalComments();

  if (totalCommentsQuery.isLoading) {
    return <Skeleton className="size-40" />;
  }

  return (
    <div className="flex justify-center items-center size-40 rounded-md shadow-md p-4">
      <div className="flex flex-col">
        <span className="text-md">Total de Comentários</span>
        <span className="text-3xl">{totalCommentsQuery.data}</span>
      </div>
    </div>
  );
};
