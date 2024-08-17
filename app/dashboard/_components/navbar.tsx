"use client";

import { CiBellOn } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { useOpenSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { FaComment } from "react-icons/fa";
import { pusherClient } from "@/lib/pusherClient";
import { Notifications } from "@/app/dashboard/_components/notifications";
export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useOpenSidebar();
  const session = useSession();
  const user = session.data?.user;
  const isDarkMode = false;

  const toggleSidebar = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    pusherClient.subscribe("notifications");
    const newLike = (data: any) => {
      toast.success(data.message, {
        icon: <FaHeart />,
      });
    };

    const newComment = (data: any) => {
      toast.success(data.message, {
        icon: <FaComment />,
      });
    };

    const newUser = (data: any) => {
      toast.success(data.message, {
        icon: <FaUser />,
      });
    };

    pusherClient.bind("likes:new", newLike);
    pusherClient.bind("comments:new", newComment);
    pusherClient.bind("users:new", newUser);

    return () => {
      pusherClient.unbind("likes:new");
      pusherClient.unbind("comments:new");
      pusherClient.unbind("users:new");

      pusherClient.unsubscribe("notifications");
    };
  }, []);

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}>
          <IoIosMenu className="w-4 h-4" />
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Start type to search groups & products"
            className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-non">
            <CiBellOn className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <Button>
            <Link href="/dashboard/new-post">Criar Post</Link>
          </Button>
          <div>
            <button onClick={() => {}}>
              {isDarkMode ? (
                <IoSunnyOutline
                  className="cursor-pointer text-gray-500"
                  size={24}
                />
              ) : (
                <IoMoonOutline
                  className="cursor-pointer text-gray-500"
                  size={24}
                />
              )}
            </button>
          </div>
          <Notifications />
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
          <div className="flex items-center gap-3 cursor-pointer">
            <Image
              src={user?.image || placeholder}
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full h-full object-cover"
            />
            <span className="font-semibold">{user?.name}</span>
          </div>
        </div>
        <Link href="/settings">
          <IoSettingsOutline
            className="cursor-pointer text-gray-500"
            size={24}
          />
        </Link>
      </div>
    </div>
  );
};
