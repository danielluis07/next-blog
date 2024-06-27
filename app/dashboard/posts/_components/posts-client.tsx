"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FormattedPosts, columns } from "./posts-columns";
import { PostsDataTable } from "./posts-table";
import { useGetPosts } from "@/queries/posts/use-get-posts";
import { useDeletePosts } from "@/queries/posts/use-delete-posts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Filters = {
  showPublishedOnly: boolean;
  showFeaturedOnly: boolean;
  showNBAOnly: boolean;
  showNFLOnly: boolean;
  showPodcastOnly: boolean;
  showOpinionOnly: boolean;
  showHistoryOnly: boolean;
  showNewsOnly: boolean;
};

export const PostsClient = () => {
  const postsQuery = useGetPosts();
  const deletePosts = useDeletePosts();
  const posts = postsQuery.data || [];
  const disabled = postsQuery.isPending;
  const [filters, setFilters] = useState<Filters>({
    showPublishedOnly: false,
    showFeaturedOnly: false,
    showHistoryOnly: false,
    showNBAOnly: false,
    showNewsOnly: false,
    showNFLOnly: false,
    showOpinionOnly: false,
    showPodcastOnly: false,
  });

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
      postType: item.post.postType,
      league: item.post.league,
      content: item.post.content,
      isPublished: item.post.isPublished ? "Sim" : "Não",
      isFeatured: item.post.isFeatured ? "Sim" : "Não",
      likes: item.post.likes,
      userId: item.post.userId,
    },
  }));

  const filterData = (data: FormattedPosts[], filters: Filters) => {
    let filteredData = data;

    if (filters.showFeaturedOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.isFeatured === "Sim"
      );
    }

    if (filters.showPublishedOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.isPublished === "Sim"
      );
    }

    if (filters.showHistoryOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.postType === "HISTÓRIA"
      );
    }

    if (filters.showNBAOnly) {
      filteredData = filteredData.filter((item) => item.post.league === "NBA");
    }

    if (filters.showNFLOnly) {
      filteredData = filteredData.filter((item) => item.post.league === "NFL");
    }

    if (filters.showNewsOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.postType === "HISTÓRIA"
      );
    }

    if (filters.showPodcastOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.postType === "PODCAST"
      );
    }

    if (filters.showNewsOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.postType === "NOTÍCIA"
      );
    }

    if (filters.showOpinionOnly) {
      filteredData = filteredData.filter(
        (item) => item.post.postType === "OPINIÃO"
      );
    }

    return filteredData;
  };

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
      <h1 className="text-xl font-bold p-3">Posts</h1>
      {postsQuery.data && (
        <div className="w-[330px] sm:w-[580px] md:w-[750px] lg:w-full mx-auto grid gap-3 grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6 border rounded-md p-3 mt-5">
          <div className="flex items-center space-x-2">
            <Input
              id="published"
              type="checkbox"
              className="size-4"
              checked={filters.showPublishedOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showPublishedOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="watches">Publicado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="featured"
              type="checkbox"
              className="size-4"
              checked={filters.showFeaturedOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showFeaturedOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="shirts">Destaque</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="history"
              type="checkbox"
              className="size-4"
              checked={filters.showHistoryOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showHistoryOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="suits">História</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="nba"
              type="checkbox"
              className="size-4"
              checked={filters.showNBAOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showNBAOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="isArchived">NBA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="nfl"
              type="checkbox"
              className="size-4"
              checked={filters.showNFLOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showNFLOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="isFeatured">NFL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="news"
              type="checkbox"
              className="size-4"
              checked={filters.showNewsOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showNewsOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="isFeatured">Notícia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="opinion"
              type="checkbox"
              className="size-4"
              checked={filters.showNewsOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showOpinionOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="isFeatured">Opinião</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="podcast"
              type="checkbox"
              className="size-4"
              checked={filters.showPodcastOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showPodcastOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="isFeatured">Podcast</Label>
          </div>
        </div>
      )}
      <PostsDataTable
        columns={columns}
        data={filterData(formattedPosts, filters)}
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
