"use client";

import { z } from "zod";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPost } from "@/queries/posts/use-get-post";
import { insertPostSchema } from "@/db/schema";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPostCategories } from "@/queries/posts/get-post-categories";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useGetCategories } from "@/queries/categories/use-get-categories";
import { UploadImage } from "@/components/uploadImage";
import { Button } from "@/components/ui/button";
import { useSummary } from "@/hooks/use-summary";
import { EditTextEditor } from "@/components/edit-text-editor";
import { SummarySheet } from "@/app/dashboard/new-post/_components/summary-sheet";
import { useEditPost } from "@/queries/posts/use-edit-post";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useDeletePost } from "@/queries/posts/use-delete-post";
import { Checkbox } from "@/components/ui/checkbox";

type EditPostProps = {
  id: string;
};

const formSchema = insertPostSchema
  .pick({
    title: true,
    description: true,
    shortDescription: true,
    imageUrl: true,
    content: true,
    isFeatured: true,
  })
  .extend({
    categoryIds: z
      .array(z.string())
      .nonempty("Selecione ao menos uma categoria"),
  });

type FormValues = z.input<typeof formSchema>;

interface Categories {
  id: string;
  name: string;
}

export const EditPostForm = ({ id }: EditPostProps) => {
  const router = useRouter();
  const { onOpen } = useSummary();
  const postQuery = useGetPost(id);
  const deleteMutation = useDeletePost(id);
  const categoriesQuery = useGetCategories();
  const postCategoriesQuery = useGetPostCategories(id);
  const [categories, setCategories] = useState<Categories[] | null>([]);
  const postCategoriesIds = postCategoriesQuery.data
    ? postCategoriesQuery?.data.map((cat) => cat.id)
    : [];
  const disabled = !categoriesQuery.isLoading && categories?.length === 0;

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a deletar esse post"
  );

  console.log(postQuery.data);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: null,
      imageUrl: "",
      content: "",
      categoryIds: [],
      isFeatured: false,
    },
  });

  const control = form.control;

  const { field: categoryField } = useController({
    control,
    name: "categoryIds",
  });

  const mutation = useEditPost(id);

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push("/dashboard/posts");
      },
    });
  };

  const onInvalid = (errors: any) => console.error(errors);

  const handleChange = (value: string) => {
    if (!categoryField.value.includes(value)) {
      categoryField.onChange([...categoryField.value, value]);
    }
  };

  const handleRemove = (value: string) => {
    categoryField.onChange(
      categoryField.value.filter((item: string) => item !== value)
    );
  };

  const availableCategories = categories?.filter(
    (category) => !categoryField.value.includes(category.id)
  );

  const selectedCategories =
    categories?.filter((category) =>
      categoryField.value.includes(category.id)
    ) || [];

  const onDelete = async () => {
    const ok = await confirm();

    if (ok)
      [
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard/posts");
          },
        }),
      ];
  };

  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  useEffect(() => {
    if (postQuery.data && postCategoriesQuery.data) {
      form.reset({
        title: postQuery.data.post.title,
        shortDescription: postQuery.data.post.shortDescription,
        description: postQuery.data.post.description,
        imageUrl: postQuery.data.post.imageUrl,
        content: postQuery.data.post.content,
        categoryIds: postCategoriesIds,
        isFeatured: postQuery.data.post.isFeatured,
      });
    }
  }, [postQuery.data, postCategoriesQuery.data, form.reset]);

  if (
    postQuery.isLoading ||
    categoriesQuery.isLoading ||
    postCategoriesQuery.isLoading
  ) {
    return (
      <div className="h-full">
        <Card className="size-full px-2 pt-2">
          <CardTitle className="pl-1 py-5">
            <Skeleton className="w-48 h-8" />
          </CardTitle>
          <div className="space-y-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="py-4">
            <Skeleton className="w-56 h-12" />
          </div>
          <div>
            <Skeleton className="w-full h-[300px]" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="size-full p-2">
        <CardTitle className="text-2xl pl-1 py-5">Edite seu Post</CardTitle>
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
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Insira uma descrição" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="shortDescription"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ? field.value : ""}
                      placeholder="Insira uma descrição curta"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {postCategoriesQuery.isLoading || !availableCategories ? (
              <div>
                <Skeleton className="w-full h-10" />
              </div>
            ) : (
              <div>
                <Select
                  onValueChange={handleChange}
                  value=""
                  disabled={disabled}>
                  <FormControl>
                    <SelectTrigger>
                      {disabled ? (
                        <span>Nenhuma categoria criada</span>
                      ) : (
                        <span>
                          {availableCategories?.length < 1 &&
                          selectedCategories.length > 0
                            ? "---"
                            : "Selecione categorias"}
                        </span>
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories
                      ?.filter(
                        (category) => !categoryField.value.includes(category.id)
                      )
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
                  {categoryField.value.map((value: string) => {
                    const category = categories?.find(
                      (cat) => cat.id === value
                    );
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
            )}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field: imageField }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-2">
                      <UploadImage
                        onChange={(url) => {
                          form.setValue("imageUrl", url);
                        }}
                        onRemove={() => {
                          form.setValue("imageUrl", "");
                        }}
                        image={form.watch("imageUrl")}
                      />
                      <Input
                        className="basis-[450px]"
                        value={imageField.value as string}
                        disabled={form.watch("imageUrl") !== ""}
                        onChange={(e) => {
                          form.setValue("imageUrl", e.target.value);
                          form.trigger("imageUrl");
                        }}
                        placeholder="ou cole a URL aqui"
                      />
                      {form.watch("imageUrl") !== "" && (
                        <Button
                          variant="destructive"
                          onClick={() => form.setValue("imageUrl", "")}>
                          Remover
                        </Button>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <EditTextEditor initialContent={field.value} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destaque</FormLabel>
                    <FormDescription>
                      Esse produto vai aparecer na página principal
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="space-x-2">
              <Button
                className="w-56"
                type="submit"
                disabled={mutation.isPending}>
                Editar
              </Button>
              <Button
                onClick={onOpen}
                className="w-56"
                type="button"
                disabled={mutation.isPending}>
                Resumo
              </Button>
              <Button
                onClick={onDelete}
                className="w-56"
                variant="destructive"
                type="button"
                disabled={mutation.isPending}>
                Deletar post
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      <SummarySheet
        title={form.watch("title")}
        description={form.watch("description")}
        imageUrl={form.watch("imageUrl")}
        onRemove={() => form.setValue("imageUrl", "")}
        selectedCategories={selectedCategories}
      />
      <ConfirmDialog />
    </>
  );
};
