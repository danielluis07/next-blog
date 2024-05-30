import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-[1980px] mx-auto min-h-screen bg-gradient-to-b from-slate-50 via-gray-100 to-zinc-200">
      <SideBar />
      <div className="flex-1 p-3">
        <Header />
        {children}
      </div>
    </div>
  );
}
