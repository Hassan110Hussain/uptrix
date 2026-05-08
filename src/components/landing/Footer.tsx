import React from "react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Uptime Monitoring", href: "#" },
    { label: "Status Pages", href: "#" },
    { label: "On-Call Escalation", href: "#" },
    { label: "API Monitoring", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Site Info", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Auth", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#10221c] border-t border-[#1c2e24] pt-12 pb-7">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-[7px] mb-3"
            >
              {/* Uptrix logo */}
              <img 
                src="/assets/Container.svg" 
                alt="Uptrix Logo" 
                width="16" 
                height="16"
                className="w-4 h-4"
              />
              <span className="text-white font-semibold text-[16px] tracking-[0.01em]">
                Uptrix
              </span>
            </Link>
            <p className="text-gray-400 text-[12px] leading-[1.6] max-w-[190px] mb-4">
              Enterprise-grade monitoring for modern infrastructure. Fast,
              accurate, and reliable.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="#"
                className="w-8 h-8 rounded flex items-center justify-center text-[#3a5a48] hover:text-[#00c896] transition-colors"
                aria-label="Earth"
              >
                <img 
                  src="/assets/earth.svg" 
                  alt="Earth Icon" 
                  width="16" 
                  height="16"
                  className="w-4 h-4"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded flex items-center justify-center text-[#3a5a48] hover:text-[#00c896] transition-colors"
                aria-label="Adarate"
              >
                <img 
                  src="/assets/adarate.svg" 
                  alt="Adarate Icon" 
                  width="14" 
                  height="14"
                  className="w-3.5 h-3.5"
                />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white text-[11px] font-semibold tracking-[0.08em] uppercase mb-3.5">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#00c896] text-[12px] transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1c2e24] pt-5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="text-gray-500 text-[11px]">
            © 2024 Uptrix Monitoring Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-gray-500 hover:text-gray-400 text-[11px] transition-colors duration-150"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
