"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserNav } from "@/components/user/user-nav";
import { Icons } from "@/components/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import {
  BarChart,
  Bolt,
  FileQuestion,
  LayoutDashboard,
  Settings,
  Trophy,
  User,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/user",
    icon: LayoutDashboard,
  },
  {
    title: "Results",
    href: "/user/completed-quizzes",
    icon: FileQuestion,
  },
  {
    title: "Leaderboard",
    href: "/user/leaderboard",
    icon: BarChart,
  },
  {
    title: "Progress",
    href: "/user/progress",
    icon: User,
  },
  {
    title: "Achievements",
    href: "/user/achievements",
    icon: Trophy,
  },
  {
    title: "Settings",
    href: "/user/profile",
    icon: Settings,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: string;
  }[];
}

function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent",
            "justify-start"
          )}
        >
          <Icons.icon className="mr-2 h-4 w-4" name={item.icon} />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function DashboardSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="z-[50] ">
      <SidebarHeader className="border-b px-4 mt-5 py-2">
        <Link href="/" className="flex items-center">
          <Bolt className="mr-2 h-6 w-6 bg-primary rounded-full p-1" />
          {state === "expanded" && (
            <span className="text-lg font-semibold">Quiz Master</span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              {state === "expanded" && (
                <div className="space-y-1">
                  <UserNav />
                </div>
              )}
            </div>
            <SidebarMenu className="mt-9 gap-3 px-2">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      isActive={isActive}
                      className=""
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {state === "expanded" && (
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} Quiz Master. All rights reserved.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
