"use client";

import React from "react";
import Head from "next/head";
import LoginComponent from "@/components/UI/Auth/Login";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Secure Access | Lantern</title>
        <meta name="description" content="Restricted access. Authorized personnel only." />
      </Head>

      {/* Fullscreen Background */}
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
        style={{
          background: "radial-gradient(circle, rgba(193,255,114,0.15) 15%, rgba(24,24,24,1) 100%)",
        }}
      >
        {/* Login Form Component */}
        <LoginComponent />
      </main>
    </>
  );
}
