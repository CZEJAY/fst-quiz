import React, { ReactNode } from "react";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/user/bottom-nav";
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <DashboardSidebar />
        <SidebarInset className="flex-1 w-full px-3 lg:px-10">
          <main className="flex mt-12 gap-6 lg:px-4 pb-24 w-full">
            {children}
          </main>
        </SidebarInset>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
};

export default layout;
