import * as React from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/user/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return <main className="w-full">{children}</main>;
}
