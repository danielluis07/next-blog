"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsCount } from "@/queries/posts/get-post-count";

export const TotalPosts = () => {
  const postsCountQuery = useGetPostsCount();

  if (postsCountQuery.isLoading) {
    return <Skeleton className="size-40" />;
  }

  return (
    <div className="flex justify-center items-center size-40 rounded-md shadow-md">
      <div className="flex flex-col">
        <span className="text-xl">Total de Posts</span>
        <span className="text-3xl">{postsCountQuery.data?.count}</span>
      </div>
    </div>
  );
};
