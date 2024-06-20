"use client";

import { z } from "zod";
import { useNewCategory } from "@/hooks/use-new-category";
import { CreateCategoryForm } from "../_forms/create-category-form";
import { useCreateCategory } from "@/queries/categories/use-create-category";
import { insertCategorySchema } from "@/db/schema";
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

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();
  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicione uma Categoria</SheetTitle>
          <SheetDescription>Insira o título da categoria</SheetDescription>
        </SheetHeader>
        <div className="mt-3">
          <CreateCategoryForm
            onSubmit={onSubmit}
            disabled={mutation.isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
