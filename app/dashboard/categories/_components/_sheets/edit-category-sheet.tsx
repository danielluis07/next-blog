"use client";

import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditCategoryForm } from "../_forms/edit-category-form";
import { insertCategorySchema } from "@/db/schema";
import { useOpenCategory } from "@/hooks/use-open-category";
import { useGetCategory } from "@/queries/categories/use-get-category";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import { useEditCategory } from "@/queries/categories/use-edit-category";
import { useDeleteCategory } from "@/queries/categories/use-delete-category";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const editMutation = useEditCategory(id);

  const categoryQuery = useGetCategory(id);

  const deleteMutation = useDeleteCategory(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a deletar essa categoria"
  );

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok)
      [
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            onClose();
          },
        }),
      ];
  };

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          {categoryQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-56 h-5" />
              <Skeleton className="w-60 h-5" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
            </div>
          ) : (
            <div>
              <SheetHeader>
                <SheetTitle>Editar Categoria</SheetTitle>
                <SheetDescription>Escolha um novo título</SheetDescription>
              </SheetHeader>
              <div className="mt-3">
                <EditCategoryForm
                  onSubmit={onSubmit}
                  defaultValues={defaultValues}
                  onDelete={onDelete}
                  disabled={editMutation.isPending || deleteMutation.isPending}
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
