import { auth } from "@/auth";
import { Avatar } from "@/components/avatar";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { Button } from "@/components/ui/button";
import { CiCirclePlus } from "react-icons/ci";
import Link from "next/link";

export const Header = async () => {
  const session = await auth();
  return (
    <div className="flex items-center justify-end w-full">
      <div className="flex items-center space-x-3">
        <Link href="/dashboard/new-post">
          <Button variant="default" className="space-x-2">
            <p>Novo Post</p>
            <CiCirclePlus className="text-lg space-x-2" />
          </Button>
        </Link>
        <Avatar imageUrl={session?.user?.image ?? placeholder} />
      </div>
    </div>
  );
};
