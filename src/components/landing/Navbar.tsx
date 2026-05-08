"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll(); // Set initial state
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent hydration mismatch by using mounted state
  const scrolledClass = mounted && isScrolled;

  const navLinks = [
    { label: "Product", href: "#features" },
    { label: "Features", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolledClass
          ? "bg-[#10221c]/98 backdrop-blur-md border-b border-[#1c2e24]"
          : "bg-[#10221c]/90 backdrop-blur-sm"
      )}
    >
      <nav
        className="max-w-[1200px] mx-auto px-5 sm:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center h-[60px]">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-[7px] shrink-0 mr-auto"
          >
            {/* Uptrix logo */}
            <img 
              src="/assets/Container.svg" 
              alt="Uptrix Logo" 
              width="18" 
              height="18"
              className="w-[18px] h-[18px]"
            />
            <span className="text-white font-semibold text-[16px] tracking-[0.01em]">
              Uptrix
            </span>
          </Link>

          {/* ── Desktop nav links — right side ── */}
          <div className="hidden md:flex items-center gap-6 mr-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[13px] font-normal transition-colors duration-150 ${
                  link.label === "Features" 
                    ? "text-[#109166] hover:text-[#00c896]" 
                    : "text-[#7a9e8a] hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Sign Up — green filled */}
            <Link
              href="/auth/register"
              className="bg-[#00c896] hover:bg-[#00b888] text-[#060d09] text-[13px] font-semibold px-[18px] py-[10px] rounded-[5px] transition-colors duration-150 leading-none"
            >
              Sign Up
            </Link>
            {/* Login — plain text */}
            <Link
              href="/auth/login"
              className="text-[#7a9e8a] hover:text-white text-[13px] font-normal px-[18px] py-[7px] border border-[#2a4035] hover:border-[#00c896]/40 rounded-[5px] transition-colors duration-150"
            >
              Login
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-1.5 text-[#7a9e8a] hover:text-white transition-colors ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0d1510] border-t border-[#1c2e24] py-3">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2.5 text-[13px] transition-colors hover:bg-[#1c2e24] ${
                    link.label === "Features" 
                      ? "text-[#109166] hover:text-[#00c896]" 
                      : "text-[#7a9e8a] hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-[#1c2e24] mt-2 pt-2 px-4 flex flex-col gap-2">
                <Link
                  href="/auth/register"
                  className="bg-[#00c896] hover:bg-[#00b888] text-[#060d09] py-2 text-[13px] font-semibold rounded-[5px] text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="text-[#7a9e8a] hover:text-white py-2 text-[13px] transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
