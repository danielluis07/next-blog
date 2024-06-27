"use client";

import { useGetLatestPosts } from "@/queries/posts/use-get-latest-posts";
import Image from "next/image";
import placeholder from "@/public/images/image-placeholder.jpg";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export const LatestPosts = () => {
  const latestPostsQuery = useGetLatestPosts();
  const data = latestPostsQuery.data || [];
  const router = useRouter();

  if (latestPostsQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-3 justify-between w-full">
        <Skeleton className="w-64 h-48" />
        <Skeleton className="w-64 h-48" />
        <Skeleton className="w-64 h-48" />
        <Skeleton className="w-64 h-48" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-3 justify-between w-full">
      {data.map((item, index) => (
        <div
          onClick={() => router.push(`/dashboard/posts/${item.id}`)}
          className="w-72 mx-auto p-3 space-y-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg shadow-lg hover:opacity-50 cursor-pointer"
          key={index}>
          <div className="relative w-full h-48">
            <Image src={item.imageUrl ?? placeholder} alt={item.title} fill />
          </div>
          <div>
            <p className="font-bold">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
