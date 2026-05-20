import { Sidebar, SidebarTrigger } from "@/components/navigation/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <SidebarTrigger />
      <Sidebar />
      {children}
    </div>
  );
}
