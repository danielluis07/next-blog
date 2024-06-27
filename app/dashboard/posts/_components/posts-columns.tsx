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
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "ADMIN" | "USER";
    emailVerified: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  post: {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    shortDescription: string | null;
    title: string;
    imageUrl: string | null;
    postType: "NOTÍCIA" | "OPINIÃO" | "PODCAST" | "HISTÓRIA";
    league: string;
    content: string;
    isPublished: string;
    isFeatured: string;
    likes: number | null;
    userId: string;
  };
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
    accessorKey: "post.title",
    header: "Título",
  },
  {
    accessorKey: "post.imageUrl",
    header: "Imagem",
    cell: ({ row }) => {
      return (
        <div>
          <div className="relative size-28 rounded-sm overflow-hidden">
            <Image
              src={
                row.original.post.imageUrl
                  ? row.original.post.imageUrl
                  : placeholder
              }
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
    accessorKey: "post.isPublished",
    header: "Publicado",
  },
  {
    accessorKey: "post.isFeatured",
    header: "Destaque",
  },
  {
    accessorKey: "post.likes",
    header: "Curtidas",
  },
  {
    accessorKey: "post.postType",
    header: "Tipo",
  },
  {
    accessorKey: "post.league",
    header: "Liga",
  },
  {
    accessorKey: "user.image",
    header: "Autor",
    cell: ({ row }) => {
      return (
        <div>
          <div className="relative size-8 rounded-full overflow-hidden">
            <Image
              src={
                row.original.user.image
                  ? row.original.user.image
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
    accessorKey: "post.createdAt",
    header: "Criado em",
  },
  {
    id: "actions",
    cell: ({ row }) => <PostsCellAction id={row.original.post.id} />,
  },
];
