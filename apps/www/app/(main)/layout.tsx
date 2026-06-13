
import { CommandBox } from "@/components/navigation/command";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/navigation/sidebar";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative w-full">
        <CommandBox />
        <AppSidebar />
        <SidebarInset className="w-full">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
