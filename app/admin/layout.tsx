import { Layout } from "@/components/admin/adminLayout";
import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <Layout>{children}</Layout>;
};

export default AdminLayout;
