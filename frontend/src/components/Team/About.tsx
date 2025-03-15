"use client";

import React from "react";

const AboutComponent: React.FC = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[800px] px-6 text-center overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="w-[900px] h-[900px]"></div>
      </div>

      {/* About Content */}
      <div className="relative z-10 max-w-5xl">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight uppercase mb-6 text-[#c1ff72]">
          About Lantern
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
          Lantern is more than technology—it&apos;s a revolution. Built for resilience, designed for impact. 
          We empower decentralized, tactical communication with cutting-edge LoRa mesh networks.
        </p>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8">
          From off-grid operations to secure networks, our mission is to redefine connectivity 
          where traditional infrastructure fails. Innovation, security, and adaptability drive us forward.
        </p>

        {/* Call to Action */}
        <button className="px-10 py-4 text-lg font-semibold rounded-full border border-[#c1ff72] bg-transparent text-[#c1ff72] transition-all hover:bg-[#c1ff72] hover:text-black shadow-md">
          Learn More
        </button>
      </div>
    </section>
  );
};

export default AboutComponent;
