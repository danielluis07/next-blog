import Link from "next/link";
import { LogoutButton } from "./auth/logout-button";
import { Button } from "./ui/button";

export const SideBar = () => {
  return (
    <nav className="w-60 maxlg:hidden bg-bluegradient p-3 h-screen">
      <div className="flex flex-col h-full justify-between">
        <Link href="/dashboard/categories">
          <Button className="w-full" variant="transparent">
            Categorias
          </Button>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
};
