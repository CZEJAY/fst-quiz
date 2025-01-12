import { getUsers } from "@/actions/user-actions";
import UsersPage from "@/components/admin/users";
import React from "react";

const users = async () => {
  const { error, users } = await getUsers();
  if (error) return <div>{error}</div>;
  return <UsersPage initial={users || []} />;
};

export default users;
