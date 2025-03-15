import React from "react";
import Head from "next/head";
import TeamGrid from "@/components/Team/TeamGrid";
import AboutComponent from "@/components/Team/About";

export default function TeamPage() {
  return (
    <>
      <Head>
        <title>Our Team | Lantern</title>
        <meta name="description" content="Meet the innovative team behind Lantern - a cutting-edge LoRa-based network for tactical, decentralized communication." />
      </Head>

      {/* Background & Main Content */}
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-dark"
        style={{
          background: "radial-gradient(circle, rgba(193,255,114,0.2) 10%, rgba(24,24,24,1) 90%)",
        }}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-[1000px] h-[1000px] bg-[#c1ff72] rounded-full blur-[180px]"></div>
        </div>

        {/* About Section & Team Grid */}
        <div className="relative z-10 w-full max-w-7xl space-y-16 py-16">
          <AboutComponent />
          <TeamGrid />
        </div>
      </main>
    </>
  );
}
