import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { MainNav } from "./main-nav";
import { Search } from "./search";
import { UserNav } from "./user-nav";
import { AppSidebar } from "./AppSideBar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider className="">
      <div className="flex  min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="block z-50">
            <div className="border-b bg-transparent backdrop-blur-sm  w-full">
              <div className="flex h-[4.4rem] items-center px-4 w-full">
                {/* <MainNav className="mx-6" /> */}
                <div className="ml-auto flex items-center space-x-4">
                  <Search />
                  <ModeToggle />
                  <UserNav />
                </div>
              </div>
            </div>
            <main className="flex mt-12 gap-6 w-full p-8">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
