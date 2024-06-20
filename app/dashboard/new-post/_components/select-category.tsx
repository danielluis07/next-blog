"use client";

import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetCategories } from "@/queries/categories/use-get-categories";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { IoClose } from "react-icons/io5";

interface SelectCategoriesProps {
  control: Control<{
    title: string;
    content: string;
    categoryIds: [string, ...string[]];
    imageUrl?: string | null | undefined;
  }>;
}

interface Categories {
  id: string;
  name: string;
}

export const SelectCategory = ({ control }: SelectCategoriesProps) => {
  const categoriesQuery = useGetCategories();
  const [categories, setCategories] = useState<Categories[] | null>([]);
  const disabled = !categoriesQuery.isLoading && categories?.length === 0;

  const { field } = useController({
    control,
    name: "categoryIds",
  });

  const handleChange = (value: string) => {
    if (!field.value.includes(value)) {
      field.onChange([...field.value, value]);
    }
  };

  const handleRemove = (value: string) => {
    field.onChange(field.value.filter((item: string) => item !== value));
  };

  const matchedCategories =
    categories?.filter((category) => field.value.includes(category.id)) || [];

  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  if (categoriesQuery.isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  return (
    <div>
      <Select onValueChange={handleChange} value="" disabled={disabled}>
        <FormControl>
          <SelectTrigger>
            {disabled ? (
              <span>Nenhuma categoria criada</span>
            ) : (
              <span>Selecionar categorias</span>
            )}
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {categories
            ?.filter((category) => !field.value.includes(category.id))
            .map((category) => (
              <SelectItem
                className="cursor-pointer"
                key={category.id}
                value={category.id}>
                {category.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap items-center space-x-2 py-2">
        {field.value.map((value: string) => {
          const category = categories?.find((cat) => cat.id === value);
          return (
            <div
              key={value}
              className="flex items-center justify-center grow-0 space-x-2 p-2 rounded-lg bg-muted">
              <p className="text-sm text-gray-400">
                {category ? category.name : value}
              </p>
              <span
                className="cursor-pointer text-md text-gray-400 hover:text-black"
                onClick={() => handleRemove(value)}>
                <IoClose />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
