"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";

type FormValues = z.input<typeof formSchema>;

type CategoryFormProps = {
  onSubmit: (values: FormValues) => void;
  defaultValues: {
    name: string;
  };
  onDelete: () => void;
  disabled: boolean;
};

const formSchema = insertCategorySchema.pick({
  name: true,
});

export const EditCategoryForm = ({
  onSubmit,
  defaultValues,
  onDelete,
  disabled,
}: CategoryFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <Button type="submit" disabled={disabled} className="w-full">
            Editar
          </Button>
          <Button
            className="w-full"
            type="button"
            variant="destructive"
            disabled={disabled}
            onClick={onDelete}>
            Deletar
          </Button>
        </div>
      </form>
    </Form>
  );
};
