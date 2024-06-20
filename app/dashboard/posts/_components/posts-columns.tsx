"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import Image from "next/image";
import placeholder from "@/public/images/image-placeholder.jpg";
import userPlaceholder from "@/public/images/placeholder-logo.jpg";
import { PostsCellAction } from "./posts-cell-action";

export type ResponseType = InferResponseType<
  typeof client.api.posts.$get,
  200
>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
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
    accessorKey: "post.title",
    header: "Título",
  },
  {
    accessorKey: "post.imageUrl",
    header: "Imagem",
    cell: ({ row }) => (
      <div className="relative size-14 rounded-sm overflow-hidden">
        <Image
          src={
            row.original.post.imageUrl
              ? row.original.post.imageUrl
              : placeholder
          }
          fill
          alt="imagem"
          className="object-cover"
          sizes="(max-width: 3840px) 56px"
        />
      </div>
    ),
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
    accessorKey: "user.image",
    header: "Autor",
    cell: ({ row }) => (
      <div className="relative size-12 rounded-full overflow-hidden">
        <Image
          src={
            row.original.user.image ? row.original.user.image : userPlaceholder
          }
          fill
          alt="imagem"
          className="object-cover"
          sizes="(max-width: 3840px) 48px"
        />
      </div>
    ),
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
