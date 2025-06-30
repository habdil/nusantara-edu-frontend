import { AppSidebar } from "@/components/shared/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}