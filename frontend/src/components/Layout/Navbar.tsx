"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-dark text-offwhite py-4 px-6 border-b border-primary shadow-glow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logos/lantern.svg"
            alt="Lantern Logo"
            width={100}
            height={70}
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
          />
          <span className="text-xl font-bold">LANTERN</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-lg font-mono">
          <Link href="/team" className="hover:text-primary transition-colors">
            Team
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
          <Link
            href="/login"
            className="hover:text-primary transition-colors border border-primary px-4 py-1 rounded-lg"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Toggle (only shown when overlay is closed) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden focus:outline-none text-offwhite"
            aria-label="Toggle menu"
          >
            <Menu size={28} />
          </button>
        )}
      </div>

      {/* Mobile Dropdown Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 text-offwhite focus:outline-none"
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          <div className="flex flex-col items-center space-y-6 text-2xl font-mono">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/team"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition-colors"
            >
              Team
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="hover:text-primary transition-colors border border-primary px-6 py-2 rounded-lg"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
