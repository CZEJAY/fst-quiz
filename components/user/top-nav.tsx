"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, User, BarChart, Bolt } from "lucide-react";
import { UserNav } from "../admin/user-nav";

const navItems = [
  { icon: Home, label: "Home", path: "/user" },
  { icon: BookOpen, label: "Quizzes", path: "/user/quizzes" },
  { icon: BarChart, label: "Results", path: "/user/completed-quizzes" },
  { icon: User, label: "Profile", path: "/user/profile" },
];

export function TopNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed top-0 left-0 right-0 z-50 shadow-md bg-background border-b border-gray-200 dark:border-gray-800 py-2"
    >
      <div className="flex items-center justify-between w-full px-5 py-1">
        <div className="flex gap-2 items-center">
          <Bolt className="bg-primary p-1 rounded-full" size={30} />
          Quiz Master
        </div>
        <UserNav />
      </div>
    </motion.nav>
  );
}
