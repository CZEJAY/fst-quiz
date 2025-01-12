"use client";

import { Crown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigation } from "./main-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  // @ts-ignore
  const { state } = useSidebar();
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" className="border-none z-[50]">
      <SidebarHeader className="h-[72px] border-b w-full flex items-center pr-8">
        <div
          className={`${
            state === "collapsed"
              ? "text-lg text-center my-auto font-bold ml-5"
              : "text-2xl text-center my-auto font-bold"
          }`}
        >
          {state === "expanded" ? "Quiz Master" : "QMT"}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="mt-9 gap-3 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  tooltip={item.name}
                  asChild
                  isActive={isActive}
                  className=""
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter className="">
        <SidebarMenuButton
          tooltip="Upgrade"
          className={`${state === "expanded" && "bg-sidebar-accent h-20 text-center w-full flex items-center justify-center"}`}
        >
          <Link
            href="/app/upgrade"
            className="flex items-center gap-3 font-bold rounded-lg"
          >
            <Crown className="h-5 w-5" />
            <span>Upgrade Plan</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter> */}
    </Sidebar>
  );
}
