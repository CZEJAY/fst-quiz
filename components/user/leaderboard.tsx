import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { User } from "@prisma/client";

const LeaderboardCard = ({ rank, user }: { rank: number; user: User }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: Trophy,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
        };
      case 2:
        return { icon: Medal, color: "text-gray-400", bgColor: "bg-gray-100" };
      case 3:
        return {
          icon: Medal,
          color: "text-orange-400",
          bgColor: "bg-orange-100",
        };
      default:
        return { icon: null, color: "text-gray-600", bgColor: "bg-gray-50" };
    }
  };

  const { icon: RankIcon, color, bgColor } = getRankStyle(rank);

  return (
    <div
      className={`p-4 ${bgColor} rounded-lg flex items-center justify-between space-x-4`}
    >
      <div className="flex items-center space-x-4 w-full">
        <div
          className={`flex items-center justify-center w-8 h-8 ${color} font-bold`}
        >
          {RankIcon ? <RankIcon className="w-6 h-6" /> : rank}
        </div>
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={user.image || "/avatar.png"}
            alt={user.name || "No user image"}
          />
          {/* @ts-ignore */}
          <AvatarFallback>{getInitials(user!.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm line-clamp-1 text-black">
            {user.name}
          </p>
          <p className="text-[9px] text-gray-500">
            {/* @ts-ignore */}
            {user.totalQuizzes} quizzes completed
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="lg:text-lg text-xs font-bold text-black">
          {/* @ts-ignore */}
          {user.averageScore.toFixed(1)}%
        </p>
        <p className="lg:text-sm text-[9px] line-clamp-1 text-gray-500">
          avg. score
        </p>
      </div>
    </div>
  );
};

const Leaderboard = ({ users }: { users: User[] }) => {
  return (
    <Card className="w-full mt-5">
      <CardHeader>
        <CardTitle className="text-2xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <LeaderboardCard key={user.id} rank={index + 1} user={user} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
