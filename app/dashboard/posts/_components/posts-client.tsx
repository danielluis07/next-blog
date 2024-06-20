"use client";

import { Card } from "@/components/ui/card";
import { columns } from "./posts-columns";
import { PostsDataTable } from "./posts-table";
import { useGetPosts } from "@/queries/posts/use-get-posts";
import { useDeletePosts } from "@/queries/posts/use-delete-posts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export const PostsClient = () => {
  const postsQuery = useGetPosts();
  const deletePosts = useDeletePosts();
  const posts = postsQuery.data || [];
  const disabled = postsQuery.isPending;

  const formattedPosts = posts.map((item) => ({
    user: {
      id: item.user.id,
      name: item.user.name,
      email: item.user.email,
      image: item.user.image,
      role: item.user.role,
      emailVerified: item.user.emailVerified,
      createdAt: item.user.createdAt,
      updatedAt: item.user.updatedAt,
    },
    post: {
      id: item.post.id,
      createdAt: item.post.createdAt
        ? format(new Date(item.post.createdAt), "dd/MM/yyyy", { locale: ptBR })
        : "N/A",
      updatedAt: item.post.updatedAt
        ? format(new Date(item.post.updatedAt), "dd/MM/yyyy", { locale: ptBR })
        : "N/A",
      description: item.post.description,
      shortDescription: item.post.shortDescription,
      title: item.post.title,
      imageUrl: item.post.imageUrl,
      content: item.post.content,
      isPublished: item.post.isPublished,
      isFeatured: item.post.isFeatured,
      likes: item.post.likes,
      userId: item.post.userId,
    },
  }));

  if (postsQuery.isLoading) {
    return (
      <div className="h-full">
        <Card className="size-full px-2 pt-2">
          <div className="space-y-3">
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-[420px] h-12" />
          </div>
          <div className="mt-8 border border-gray-300 rounded-lg p-3">
            <div className="flex border-b pb-2">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-24 h-5 ml-32" />
              <Skeleton className="w-32 h-5 ml-32" />
              <Skeleton className="w-32 h-5 ml-32" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="mt-8 space-y-5">
              <div className="flex items-center border-b pb-4">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="w-32 h-20 ml-32" />
                <Skeleton className="w-32 h-5 ml-[97px]" />
                <Skeleton className="w-32 h-5 ml-32" />
                <Skeleton className="w-32 h-5 ml-32" />
              </div>
              <div className="flex items-center border-b pb-4">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="w-32 h-20 ml-32" />
                <Skeleton className="w-32 h-5 ml-[97px]" />
                <Skeleton className="w-32 h-5 ml-32" />
                <Skeleton className="w-32 h-5 ml-32" />
              </div>
              <div className="flex items-center border-b pb-4">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="w-32 h-20 ml-32" />
                <Skeleton className="w-32 h-5 ml-[97px]" />
                <Skeleton className="w-32 h-5 ml-32" />
                <Skeleton className="w-32 h-5 ml-32" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="size-full px-2 pt-2">
      <h1 className="text-xl font-bold">Posts</h1>
      <PostsDataTable
        columns={columns}
        data={formattedPosts}
        disabled={disabled}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.post.id);
          deletePosts.mutate({ ids });
        }}
        searchKey="title"
      />
    </Card>
  );
};
