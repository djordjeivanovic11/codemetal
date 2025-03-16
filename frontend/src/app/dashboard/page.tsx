"use client";

import React from "react";
import ApplicationSelector from "@/components/UI/Dashboard/ControlPanel/ApplicationSelect";
import GoogleMap from "@/components/UI/Dashboard/Map/GoogleMap";
import { SearchResultsProvider } from "@/components/Context/ResultContext";

export default function Dashboard() {
  return (
    <SearchResultsProvider>
      <main className="flex h-screen bg-[#121212]">
        {/* Left Sidebar */}
        <ApplicationSelector />
        {/* Right Panel - Google Maps */}
        <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center">
          <GoogleMap />
        </div>
      </main>
    </SearchResultsProvider>
  );
}
