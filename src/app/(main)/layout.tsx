import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/features/providers/query-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        {/* <AppSidebar /> */}
        <SidebarInset className="h-dvh">{children}</SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
