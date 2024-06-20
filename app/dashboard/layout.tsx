import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col max-w-[1980px] mx-auto min-h-screen overflow-y-scroll bg-gradient-to-b from-slate-50 via-gray-100 to-zinc-200">
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-3 flex flex-col">
          <Header />
          <div className="flex-1 pt-3">{children}</div>
        </main>
      </div>
    </div>
  );
}
