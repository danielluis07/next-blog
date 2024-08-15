"use client";

import { CiLogout } from "react-icons/ci";
import { Button } from "../ui/button";
import { logOut } from "@/actions/logout";
import { useTransition } from "react";
import { toast } from "sonner";
import { ExitModal } from "@/modals/exit-modal";

export const LogoutButton = () => {
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
      <Button
        onClick={onClick}
        variant="destructive"
        className="space-x-2 my-2 w-full">
        <CiLogout className="text-lg" />
        <p>Sair</p>
      </Button>
    </>
  );
};
