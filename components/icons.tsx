import {
  LightbulbIcon as LucideProps,
  Moon,
  SunMedium,
  Twitter,
  Menu,
  LayoutDashboard,
  FileQuestion,
  Trophy,
  Settings,
  BarChart,
  User,
} from "lucide-react";

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  menu: Menu,
  dashboard: LayoutDashboard,
  quiz: FileQuestion,
  leaderboard: BarChart,
  progress: User,
  trophy: Trophy,
  settings: Settings, // @ts-ignore
  icon: ({ name, ...props }: LucideProps & { name: string }) => {
    // @ts-ignore
    const Icon = Icons[name];
    return Icon ? <Icon {...props} /> : null;
  },
};
