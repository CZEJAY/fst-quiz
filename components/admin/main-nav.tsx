import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookAIcon,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Users,
} from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Quizzes",
    href: "/admin/quizzes",
    icon: FileQuestion,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: ListOrdered,
  },
  {
    name: "Questions",
    href: "/admin/questions",
    icon: BookAIcon,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Results",
    href: "/admin/results",
    icon: BarChart3,
  },
  {
    name: "Learning",
    href: "/admin/learning",
    icon: GraduationCap,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex items-center w-full space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
