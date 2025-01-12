"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, User, BarChart, BookCheck } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/user" },
  { icon: BarChart, label: "Leaders", path: "/user/leaderboard" },
  { icon: BookCheck, label: "Results", path: "/user/completed-quizzes" },
  { icon: User, label: "Profile", path: "/user/profile" },
];

export function BottomNav() {
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
      className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 dark:border-gray-800 py-2"
    >
      <ul className="flex justify-around items-center">
        {navItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center p-2 ${
                pathname === item.path
                  ? "text-black bg-primary rounded-md "
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
