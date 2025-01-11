import { getLeaderboard } from "@/actions/leaderboard";
import { DashboardHeader } from "@/components/user/dashboard-header";
import Leaderboard from "@/components/user/leaderboard";
import React from "react";

const page = async () => {
  const { error, processedLeaderboard } = await getLeaderboard();
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="w-full">
      <DashboardHeader
        heading="Leader Board"
        text="View your ranking in the leaderboard below."
      />
      <Leaderboard users={processedLeaderboard} />
    </div>
  );
};

export default page;
