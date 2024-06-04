"use client";

import { z } from "zod";
import { useCreateCategory } from "@/queries/use-create-category";
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

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type SummaryProps = {
  title: string | null;
  imageUrl: string | null | undefined;
  onRemove: (url?: string | undefined) => void;
};

export const SummarySheet = ({ title, imageUrl, onRemove }: SummaryProps) => {
  const { isOpen, onClose } = useSummary();
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
          <SheetTitle>Resumo</SheetTitle>
          <SheetDescription>Confira o resumo do seu post</SheetDescription>
        </SheetHeader>
        <Separator className="my-5" />
        <div>
          <p className="mb-2">{title ? title : "Título"}</p>
          <div className="relative w-full h-72 bg-cover rounded-md overflow-hidden">
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
              priority
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
