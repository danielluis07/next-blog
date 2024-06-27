"use client";

import { z } from "zod";
import { useCreateCategory } from "@/queries/categories/use-create-category";
import { insertCategorySchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSummary } from "@/hooks/use-summary";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import placeholder from "@/public/images/image-placeholder.jpg";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Categories = {
  id: string;
  name: string;
};

type SummaryProps = {
  title: string;
  description: string;
  imageUrl: string | null | undefined;
  league: string;
  postType: string;
  selectedCategories: Categories[];
  onRemove: (url?: string | undefined) => void;
};

export const SummarySheet = ({
  title,
  description,
  imageUrl,
  league,
  postType,
  selectedCategories,
  onRemove,
}: SummaryProps) => {
  const { isOpen, onClose } = useSummary();
  const mutation = useCreateCategory();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          <SheetTitle>Resumo</SheetTitle>
          <SheetDescription>Confira o resumo do seu post</SheetDescription>
        </SheetHeader>
        <Separator className="my-5" />
        <div className="h-[500px] overflow-y-auto">
          <p className="mb-2 text-xl">{title ? title : "Título"}</p>
          <p className="text-gray-400">
            {description ? description : "Descrição"}
          </p>
          {isLoading && (
            <div>
              <Skeleton className="w-full h-72" />
            </div>
          )}
          <div className="relative mt-2 w-full h-72 bg-cover rounded-md overflow-hidden">
            {imageUrl && (
              <div
                onClick={() => onRemove()}
                className="absolute top-0 right-0 p-1 z-10 rounded-sm bg-rose-500 cursor-pointer">
                <IoClose className="text-white" />
              </div>
            )}
            <Image
              src={imageUrl ? imageUrl : placeholder}
              alt="preview"
              fill
              onLoad={() => setIsLoading(false)}
              priority
            />
          </div>
          <div className="mt-2">
            <div>
              <span>Liga: {league}</span>
              <span>Tipo: {postType}</span>
            </div>
            <div>
              <span className="mt-2">Categorias</span>
              <div className="flex flex-wrap items-center space-x-2 pb-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-center grow-0 p-2 rounded-lg bg-muted">
                    <p className="text-sm text-gray-400">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1">
          <Button className="w-full">Publicar</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
