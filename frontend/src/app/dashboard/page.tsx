"use client";

import React from "react";
import ApplicationSelector from "@/components/UI/Dashboard/ControlPanel/ApplicationSelect";
import GoogleMap from "@/components/UI/Dashboard/Map/GoogleMap";

export default function Dashboard() {
  return (
    <main className="flex h-screen bg-[#121212]">
      {/* Left Sidebar */}
      <ApplicationSelector />
      {/* Right Panel - Placeholder for Google Maps */}
      <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center text-gray-400 text-2xl">
        <GoogleMap />
      </div>
    </main>
  );
}
