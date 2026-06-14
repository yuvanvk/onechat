
import { CommandBox } from "@/components/navigation/command";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-black!">
      <CommandBox />
      <AppSidebar />
      <SidebarInset className="w-full">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
