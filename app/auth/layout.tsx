import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex h-screen items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
