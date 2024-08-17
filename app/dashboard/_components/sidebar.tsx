"use client";

import { IoIosMenu } from "react-icons/io";
import { MdOutlineArticle } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons/lib";
import placeholder from "@/public/images/placeholder-logo.jpg";
import { useOpenSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { LogoutButtonIcon } from "@/components/auth/logout-button-icon";

interface SidebarLinkProps {
  href: string;
  icon: IconType;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const setIsSidebarCollapsed = false;
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}>
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useOpenSidebar();
  const session = useSession();
  const user = session.data?.user;

  const toggleSidebar = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const sidebarClassNames = `fixed flex flex-col px-2 ${
    !isOpen ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={cn(
          !isOpen ? "px-0 justify-center" : "px-8 justify-normal gap-3",
          "flex items-center pt-8"
        )}>
        <Image
          src={user?.image || placeholder}
          alt="daniel-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <h1
          className={cn(
            !isOpen ? "hidden" : "block",
            "font-extrabold text-2xl"
          )}>
          STOCK
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}>
          <IoIosMenu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/"
          icon={FaHouse}
          label="Início"
          isCollapsed={!isOpen}
        />
        <SidebarLink
          href="/dashboard/posts"
          icon={MdOutlineArticle}
          label="Posts"
          isCollapsed={!isOpen}
        />
        <SidebarLink
          href="/dashboard/categories"
          icon={TbCategory}
          label="Categorias"
          isCollapsed={!isOpen}
        />
        <SidebarLink
          href="/dashboard/users"
          icon={FaUser}
          label="Usuários"
          isCollapsed={!isOpen}
        />
        <SidebarLink
          href="/dashboard/comments"
          icon={FaRegComment}
          label="Comentários"
          isCollapsed={!isOpen}
        />
      </div>

      {/* FOOTER */}
      <div className={cn(!isOpen ? "hidden" : "block", "mb-10")}>
        <LogoutButton />
        <p className="text-center text-xs text-gray-500">&copy; 2024 Stock</p>
      </div>
      <div
        className={cn(
          !isOpen ? "block" : "hidden",
          "mb-10 border border-black hover:border-red-500 rounded-lg"
        )}>
        <LogoutButtonIcon isCollapsed={!isOpen} />
      </div>
    </div>
  );
};
