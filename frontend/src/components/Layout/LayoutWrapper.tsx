"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
};

export default LayoutWrapper;
