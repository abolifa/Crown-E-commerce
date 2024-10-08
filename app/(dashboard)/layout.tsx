"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export const queryClient = new QueryClient();

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen overflow-x-hidden flex flex-col">
        <Navbar />
        <div className="flex w-full">
          <Sidebar />
          <div className="flex-1 p-5">{children}</div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardLayout;
