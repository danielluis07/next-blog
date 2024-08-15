import DashboardWrapper from "./_components/dashboard-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
