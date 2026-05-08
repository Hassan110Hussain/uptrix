import React from "react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-5 px-5 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative rounded-xl overflow-hidden px-7 py-11 sm:px-12 text-center"
          style={{
            background: "#0cab77",
          }}
        >
          <div className="relative max-w-[520px] mx-auto">
            <h2 className="text-[22px] sm:text-[26px] font-bold text-white mb-2.5 leading-snug">
              Ready to secure your uptime?
            </h2>
            <p className="text-white/80 text-[13px] mb-6 leading-[1.6]">
              Join over 10,000 developers who trust Uptrix to keep their services
              running 24/7/365.
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center bg-[#0a0f0d] hover:bg-[#0d1510] text-white font-semibold px-5 py-2.5 rounded-[5px] text-[13px] transition-colors duration-150"
              >
                Get Started for Free
              </Link>
              <Link
                href="#"
                className="inline-flex items-center bg-transparent border border-white/30 hover:border-white/60 text-white hover:bg-white/10 font-medium px-5 py-2.5 rounded-[5px] text-[13px] transition-colors duration-150"
              >
                Talk to Sales
              </Link>
            </div>

            <p className="text-white/60 text-[11px] mt-3.5">
              No credit card required · Free plan available · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
