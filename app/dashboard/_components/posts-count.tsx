"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPostsCount } from "@/queries/posts/get-post-count";

export const PostsCount = () => {
  const postsCountQuery = useGetPostsCount();

  if (postsCountQuery.isLoading) {
    return <Skeleton className="size-40" />;
  }

  return (
    <div className="flex justify-center items-center size-40 rounded-md bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg">
      <div className="flex flex-col">
        <span className="text-5xl text-center">
          {postsCountQuery.data?.count}
        </span>
        <span className="text-xl">Posts</span>
      </div>
    </div>
  );
};
