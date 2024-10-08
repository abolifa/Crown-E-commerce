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
      <div className="w-screen h-screen flex">
        <Sidebar />
        <div className="w-full h-full">
          <Navbar />
          <div className="p-5 bg-muted h-full">{children}</div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardLayout;
