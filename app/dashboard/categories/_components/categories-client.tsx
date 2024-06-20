"use client";

import { useGetCategories } from "@/queries/categories/use-get-categories";
import { CategoriesDataTable } from "./categories-table";
import { columns } from "./categories-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useDeleteCategories } from "@/queries/categories/use-delete-categories";

export const CategoriesClient = () => {
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];
  const deleteCategories = useDeleteCategories();
  const disabled = deleteCategories.isPending;

  if (categoriesQuery.isLoading) {
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
      <h1 className="text-xl font-bold">Categorias</h1>
      <CategoriesDataTable
        columns={columns}
        data={categories}
        disabled={disabled}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          deleteCategories.mutate({ ids });
        }}
        searchKey="name"
      />
    </Card>
  );
};
