"use client";

import { CiLogout } from "react-icons/ci";
import { logOut } from "@/actions/logout";
import { useTransition } from "react";
import { toast } from "sonner";
import { ExitModal } from "@/modals/exit-modal";
import { cn } from "@/lib/utils";

interface LogoutButtonIconLinkProps {
  isCollapsed: boolean;
}

export const LogoutButtonIcon = ({
  isCollapsed,
}: LogoutButtonIconLinkProps) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      logOut().catch((error) => {
        console.log(error);
        toast.error("Ocorreu um erro ao tentar sair");
      });
    });
  };
  return (
    <>
      <ExitModal exited={isPending} />
      <button
        onClick={onClick}
        className={cn(
          "cursor-pointer flex items-center hover:text-red-500 w-full",
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        )}>
        <CiLogout className="text-lg" />
      </button>
    </>
  );
};
