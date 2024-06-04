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
  defaultValues?: {
    name: string;
  };
  disabled: boolean;
};

const formSchema = insertCategorySchema.pick({
  name: true,
});

export const CreateCategoryForm = ({
  onSubmit,
  defaultValues,
  disabled,
}: CategoryFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-3">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabled} className="w-full">
          Criar
        </Button>
      </form>
    </Form>
  );
};
