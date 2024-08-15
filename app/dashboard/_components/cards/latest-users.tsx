"use client";

import Image from "next/image";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { getLatestUsers } from "@/queries/users/get-latest-users";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Skeleton } from "@/components/ui/skeleton";

export const LatestUsers = () => {
  const { data, isLoading } = getLatestUsers();
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
            Usuários Recentes
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {data?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden">
                    <Image
                      src={item.image || placeholder}
                      fill
                      alt="imagem"
                      sizes="(50vw, 100vh)"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">{item.name}</div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        Desde
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
