import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import DarkModeToggle from "../DarkModeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Dark mode toggle button */}
          <DarkModeToggle />
        </div>

        {/* Page content */}
        <div className="container mx-auto p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
