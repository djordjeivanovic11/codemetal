import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-dark text-offwhite py-8 px-6 border-t border-primary shadow-glow">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Left Side - Branding & Motto */}
        <div className="max-w-sm">
          <p className="text-primary text-lg font-semibold tracking-wide">
            Illuminating Connectivity, Beyond Limits
          </p>
          <p className="mt-1 text-sm text-muted">
            Lantern: LoRa-based Advanced Network for Tactical Edge Resilient Nodes.
          </p>
        </div>

        {/* Right Side - Navigation Links */}
        <div className="mt-6 md:mt-0 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
          <Link href="/" className="hover:text-primary transition-all">
            Home
          </Link>
          <Link href="/team" className="hover:text-primary transition-all">
            Team
          </Link>
          <Link href="/contact" className="hover:text-primary transition-all">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-all">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-all">
            Terms
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-primary/30 my-6"></div>

      {/* Copyright */}
      <div className="text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Lantern. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
