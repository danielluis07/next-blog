"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { CiEdit } from "react-icons/ci";
import { LiaTrashAltSolid } from "react-icons/lia";
import { IoIosMore } from "react-icons/io";
import { useOpenCategory } from "@/hooks/use-open-category";
import { useDeleteCategory } from "@/queries/categories/use-delete-category";
import { useRouter } from "next/navigation";

interface PostsCellActionProps {
  id: string;
}

export const PostsCellAction = ({ id }: PostsCellActionProps) => {
  const router = useRouter();
  const deleteMutation = useDeleteCategory(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a deletar o post selecionado"
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <IoIosMore className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/posts/${id}`)}>
            <CiEdit className="mr-2 size-5 text-blue-700" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
            onClick={onDelete}>
            <LiaTrashAltSolid className="mr-2 size-5 text-red-500" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
