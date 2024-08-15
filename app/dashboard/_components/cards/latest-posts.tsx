"use client";

import Image from "next/image";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { getLatestPosts } from "@/queries/posts/get-latest-posts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const LatestPosts = () => {
  const { data, isLoading } = getLatestPosts();
  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <>
          <div className="p-5">
            <Skeleton className="w-28 h-10" />
          </div>
          <hr />
          <div className="overflow-auto h-full">
            <div className="flex items-center justify-between gap-3 px-5 py-7 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="w-14 h-14" />
                <div className="flex flex-col justify-between gap-1">
                  <Skeleton className="w-14 h-5" />
                  <div className="flex text-sm items-center">
                    <Skeleton className="w-8 h-5" />
                    <span className="mx-2">
                      <Skeleton className="w-20 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-7 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="w-14 h-14" />
                <div className="flex flex-col justify-between gap-1">
                  <Skeleton className="w-14 h-5" />
                  <div className="flex text-sm items-center">
                    <Skeleton className="w-8 h-5" />
                    <span className="mx-2">
                      <Skeleton className="w-20 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-7 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="w-14 h-14" />
                <div className="flex flex-col justify-between gap-1">
                  <Skeleton className="w-14 h-5" />
                  <div className="flex text-sm items-center">
                    <Skeleton className="w-8 h-5" />
                    <span className="mx-2">
                      <Skeleton className="w-20 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-7 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="w-14 h-14" />
                <div className="flex flex-col justify-between gap-1">
                  <Skeleton className="w-14 h-5" />
                  <div className="flex text-sm items-center">
                    <Skeleton className="w-8 h-5" />
                    <span className="mx-2">
                      <Skeleton className="w-20 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Últimos posts
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {data?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b">
                <div className="flex items-center gap-3">
                  <Image
                    src={item.imageUrl || placeholder}
                    alt={item.title || ""}
                    width={70}
                    height={70}
                    className="rounded-lg"
                  />
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700 line-clamp-2 hover:underline cursor-pointer">
                      <Link href={`/dashboard/posts/${item.id}`}>
                        {item.title}
                      </Link>
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        Criado em
                      </span>
                      <span className="mx-2 text-[12px]">
                        {format(
                          item.createdAt as string | number | Date,
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
