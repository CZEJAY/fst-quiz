import * as React from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return <main className="w-full">{children}</main>;
}
