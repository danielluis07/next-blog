"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getTotalLikes } from "@/queries/get-total-likes";

export const TotalLikes = () => {
  const totalViewsQuery = getTotalLikes();

  if (totalViewsQuery.isLoading) {
    return <Skeleton className="size-40" />;
  }

  return (
    <div className="flex justify-center items-center size-40 rounded-md shadow-md">
      <div className="flex flex-col">
        <span className="text-xl">Total de Likes</span>
        <span className="text-3xl">{totalViewsQuery.data}</span>
      </div>
    </div>
  );
};
