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
import { insertPostSchema } from "@/db/schema";
import { useCreatePost } from "@/queries/use-create-post";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/text-editor";
import { Card } from "@/components/ui/card";
import { UploadImage } from "@/components/uploadImage";
import { SelectCategory } from "./select-category";
import { useSummary } from "@/hooks/use-summary";
import { SummarySheet } from "./summary-sheet";

const formSchema = insertPostSchema
  .pick({
    title: true,
    imageUrl: true,
    content: true,
  })
  .extend({
    categoryIds: z
      .array(z.string())
      .nonempty("Selecione ao menos uma categoria"),
  });

type FormValues = z.input<typeof formSchema>;

export const PostForm = () => {
  const router = useRouter();
  const { onOpen } = useSummary();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      content: "",
      categoryIds: [],
    },
  });

  const mutation = useCreatePost();

  const onSubmit = (values: FormValues) => {
    console.log(values);
    /*     mutation.mutate(values, {
      onSuccess: () => {
        router.push("/");
      },
    }); */
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <>
      <Card className="size-full p-2">
        <div onClick={onOpen}>open</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-2">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Insira um título" />
                  </FormControl>
                </FormItem>
              )}
            />
            <SelectCategory control={form.control} />
            <div className="flex justify-start w-full">
              <FormField
                control={form.control}
                name="imageUrl"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <UploadImage
                        onChange={(url) => {
                          form.setValue("imageUrl", url);
                        }}
                        onRemove={() => {
                          form.setValue("imageUrl", "");
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextEditor content={field.value} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="w-56"
              type="submit"
              disabled={mutation.isPending}>
              Criar
            </Button>
          </form>
        </Form>
      </Card>
      <SummarySheet
        title={form.watch("title")}
        imageUrl={form.watch("imageUrl")}
        onRemove={() => form.setValue("imageUrl", "")}
      />
    </>
  );
};
