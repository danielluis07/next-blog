"use client";

import Image from "next/image";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestComments } from "@/queries/get-latest-comments";

export const LatestComments = () => {
  const { data, isLoading } = getLatestComments();
  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <>
          <Skeleton className="w-28 h-10 pb-5" />
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
            Comentários recentes
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {data?.data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col justify-between gap-y-3">
                    <h2 className="font-bold text-gray-700 line-clamp-2">
                      {item.post.title}
                    </h2>
                    <div className="flex items-center gap-x-2">
                      <Image
                        src={item.user.image || placeholder}
                        alt={item.user.name || ""}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="font-semibold text-blue-500 text-xs">
                        {item.user.name}
                      </span>
                    </div>
                    <p className="truncate text-sm">"{item.comment.text}"</p>
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
