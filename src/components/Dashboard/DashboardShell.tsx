'use client';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Dashboard/Sidebar';

interface DashboardShellProps {
  lang: string;
  children: React.ReactNode;
}

export default function DashboardShell({ lang, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        lang={lang}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0">
        {/* Mobile top bar with menu toggle */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu">
            <Menu className="w-5 h-5 text-gray-800" />
          </button>
          <span className="text-base font-semibold text-[#004225]">Dashboard</span>
        </div>

        <div className="px-4 sm:px-6 lg:px-[28px] py-6 lg:pt-[46px]">
          {children}
        </div>
      </main>
    </div>
  );
}
