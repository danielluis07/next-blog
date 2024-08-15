"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getTotalViews } from "@/queries/get-total-views";

export const TotalViews = () => {
  const totalViewsQuery = getTotalViews();

  if (totalViewsQuery.isLoading) {
    return <Skeleton className="size-40" />;
  }

  return (
    <div className="flex justify-center items-center size-40 rounded-md shadow-md p-4">
      <div className="flex flex-col">
        <span className="text-md">Total de Vizualizações</span>
        <span className="text-3xl">{totalViewsQuery.data}</span>
      </div>
    </div>
  );
};
