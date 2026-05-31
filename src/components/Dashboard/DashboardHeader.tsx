"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function DashboardHeader({
  title,
  searchPlaceholder = "Search restaurant and cuisines...",
  onSearch,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-[22px] sm:text-[28px] font-bold text-[#006653]">
          {title}
        </h1>

        <div className="relative w-full sm:max-w-md">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full bg-white h-[42px] pl-4 pr-12 py-2 text-gray-700 placeholder:text-gray-400 border-gray-200 focus-visible:ring-[#006653]/30 focus-visible:border-[#006653]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
