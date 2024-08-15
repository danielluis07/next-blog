"use client";

import Image from "next/image";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";

export type ResponseType = InferResponseType<
  typeof client.api.protected.users.$get,
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
    accessorKey: "image",
    header: "Imagem",
    cell: ({ row }) => {
      return (
        <div>
          <div className="relative size-10 rounded-full overflow-hidden">
            <Image
              src={row.original.image || placeholder}
              fill
              alt="imagem"
              sizes="(50vw, 100vh)"
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
];
