"use client";

import { z } from "zod";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertPostSchema, league, postType } from "@/db/schema";
import { useCreatePost } from "@/queries/posts/use-create-post";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/text-editor";
import { Card, CardTitle } from "@/components/ui/card";
import { UploadImage } from "@/components/uploadImage";
import { useSummary } from "@/hooks/use-summary";
import { SummarySheet } from "@/components/summary-sheet";
import { useGetCategories } from "@/queries/categories/use-get-categories";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { IoClose } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = insertPostSchema
  .pick({
    title: true,
    description: true,
    shortDescription: true,
    imageUrl: true,
    league: true,
    postType: true,
    content: true,
    isPublished: true,
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

export const PostForm = () => {
  const router = useRouter();
  const { onOpen } = useSummary();
  const categoriesQuery = useGetCategories();
  const [categories, setCategories] = useState<Categories[] | null>([]);
  const disabled = categories?.length === 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: null,
      imageUrl: "",
      content: "",
      league: undefined,
      postType: undefined,
      isPublished: false,
      categoryIds: [],
      isFeatured: false,
    },
  });

  const control = form.control;

  const { field: categoryField } = useController({
    control,
    name: "categoryIds",
  });

  const mutation = useCreatePost();

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

  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  if (!availableCategories) {
    return <p>Nenhuma categoria encontrada</p>;
  }

  if (categoriesQuery.isLoading) {
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
        <CardTitle className="text-2xl pl-1 py-5">Crie seu post</CardTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-3">
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
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder="Insira uma descrição" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="league"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger>
                        <span className="text-muted-foreground">
                          {field.value ? field.value : "Selecione a liga"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {league.enumValues.map((option, index) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={index}
                            value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="postType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger>
                        <span className="text-muted-foreground">
                          {field.value
                            ? field.value
                            : "Selecione o tipo de post"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {postType.enumValues.map((option, index) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={index}
                            value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Select onValueChange={handleChange} value="" disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  {disabled ? (
                    <span className="text-muted-foreground">
                      Nenhuma categoria criada
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
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
                    <TextEditor content={field.value} {...field} />
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
                      disabled={mutation.isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destaque</FormLabel>
                    <FormDescription>
                      Esse produto vai aparecer no carrosel
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={mutation.isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Publicar</FormLabel>
                    <FormDescription>
                      Esse produto vai aparecer no blog
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
                Salvar
              </Button>
              <Button
                onClick={onOpen}
                className="w-56"
                type="button"
                disabled={mutation.isPending}>
                Prévia
              </Button>
            </div>
          </form>
        </Form>
      </Card>
      <SummarySheet
        title={form.watch("title")}
        description={form.watch("description")}
        imageUrl={form.watch("imageUrl")}
        league={form.watch("league")}
        postType={form.watch("postType")}
        onRemove={() => form.setValue("imageUrl", "")}
        selectedCategories={selectedCategories}
      />
    </>
  );
};
