import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#10221c] pt-[52px] overflow-hidden">
      {/* Subtle glow */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 25% 35%, rgba(0,200,150,0.08) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 w-full py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* ── Left: Text ── */}
          <div>
            {/* Eyebrow with capsule design */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-[#00c896]/30 bg-[#00c896]/10">
              <span className="text-[#00c896] text-[11px] font-semibold tracking-[0.08em] uppercase">
                Powerful Capabilities
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[32px] sm:text-[38px] lg:text-[42px] font-bold leading-[1.15] text-white mb-4">
              Enterprise Grade{" "}
              <span className="text-[#00c896]">Monitoring</span>
              <br />
              <span className="text-[#00c896]">Engine</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[#7a9e8a] text-[14px] leading-[1.6] mb-6 max-w-[420px]">
              A comprehensive suite of tools built for speed, accuracy, and
              reliability. Monitor your online infrastructure from a single &amp;
              unified dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center bg-[#00c896] hover:bg-[#00b888] text-[#060d09] font-semibold px-5 py-2.5 rounded-[5px] text-[13px] transition-colors duration-150"
              >
                Start Monitoring Free
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center bg-transparent border border-[#2a4035] hover:border-[#00c896]/40 text-white hover:text-white font-medium px-5 py-2.5 rounded-[5px] text-[13px] transition-colors duration-150"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* ── Right: Dashboard preview ── */}
          <div className="relative">
            {/* Glow behind */}
            <div
              className="absolute -inset-3 rounded-xl pointer-events-none opacity-50"
              style={{
                background:
                  "radial-gradient(ellipse at 55% 50%, rgba(0,180,200,0.09) 0%, transparent 68%)",
              }}
              aria-hidden="true"
            />

            {/* Dashboard Image */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/assets/ImageOverlay.svg"
                alt="Uptrix Dashboard - Real-time monitoring interface showing uptime statistics, response times, and system health metrics"
                className="w-full h-auto rounded-lg"
                style={{
                  border: "1px solid rgba(0,180,200,0.14)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
