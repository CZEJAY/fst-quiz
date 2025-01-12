import { Layout } from "@/components/admin/adminLayout";
import { AppSidebar } from "@/components/admin/AppSideBar";
import { ModeToggle } from "@/components/admin/mode-toggle";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider className="">
      <div className="flex  min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          <div className="w-full z-50 border-b bg-background  border-gray-200 dark:border-gray-800 py-1">
            <div className=" bg-transparent backdrop-blur-sm  w-full">
              <div className="flex h-[4.4rem] items-center px-4 w-full">
                <div className="">
                  <SidebarTrigger size={"lg"} />
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  {/* <Search /> */}
                  <ModeToggle />
                  <UserNav />
                </div>
              </div>
            </div>
          </div>
          <main className="flex mt-12 gap-6 lg:px-4 py-10 pb-24 w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
