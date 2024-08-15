"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import Image from "next/image";
import placeholder from "@/public/images/image-placeholder.jpg";
import userPlaceholder from "@/public/images/placeholder-logo.jpg";
import { PostsCellAction } from "./posts-cell-action";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/* export type ResponseType = InferResponseType<
  typeof client.api.protected.posts.$get,
  200
>["data"][0]; */

export type FormattedPosts = {
  id: string;
  title: string;
  shortDescription: string | null;
  imageUrl: string | null;
  league: string;
  postType: string;
  views: number | null;
  isPublished: string;
  isFeatured: string;
  userId: string;
  userImage: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  likes: number;
};

export const columns: ColumnDef<FormattedPosts>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => {
      return (
        <div>
          <div className="relative size-28 rounded-sm overflow-hidden">
            <Image
              src={row.original.imageUrl ? row.original.imageUrl : placeholder}
              fill
              alt="imagem"
              sizes="(max-width: 3840px) 700px"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Publicado",
  },
  {
    accessorKey: "isFeatured",
    header: "Destaque",
  },
  {
    accessorKey: "likes",
    header: "Curtidas",
  },
  {
    accessorKey: "postType",
    header: "Tipo",
  },
  {
    accessorKey: "league",
    header: "Liga",
  },
  {
    accessorKey: "userImage",
    header: "Autor",
    cell: ({ row }) => {
      return (
        <div>
          <div className="relative size-8 rounded-full overflow-hidden">
            <Image
              src={
                row.original.userImage
                  ? row.original.userImage
                  : userPlaceholder
              }
              fill
              alt="imagem"
              className="object-cover"
              sizes="(max-width: 3840px) 48px"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
  },
  {
    id: "actions",
    cell: ({ row }) => <PostsCellAction id={row.original.id} />,
  },
];
