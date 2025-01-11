import { getUserProfile } from "@/actions/leaderboard";
import { DashboardHeader } from "@/components/user/dashboard-header";
import UserProfile from "@/components/user/UserProfile";
import React from "react";

const page = async () => {
  const { error, profile } = await getUserProfile();
  if (error) {
    return <div className="">{error}</div>;
  }
  return (
    <div className="w-full">
      <DashboardHeader heading="Profile" text="Update your profile settings." />
      {/* @ts-ignore */}
      <UserProfile profile={profile} />
    </div>
  );
};

export default page;
