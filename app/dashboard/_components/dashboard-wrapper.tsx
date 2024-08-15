"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/app/dashboard/_components/sidebar";
import { Navbar } from "@/app/dashboard/_components/navbar";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = false;

  return (
    <div>
      <Sidebar />
      <main
        className={cn(
          "flex flex-col w-full h-full py-7 px-9 bg-gray-50",
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        )}>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
