import React from "react";

const items = [
  {
    icon: "icon.svg", // Custom SVG for Multi-Region Verification
    title: "Multi-Region Verification",
    description:
      "If a location goes down, we verify from 3+ independent response locations before alerting.",
  },
  {
    icon: "lock.svg", // Custom SVG for SSL/TLS Integrity
    title: "SSL/TLS Integrity",
    description:
      "Continuous certificate chain checks. Get notified 30, 15, and 7 days before expiry.",
  },
  {
    icon: "cust.svg", // Custom SVG for Custom Protocols
    title: "Custom Protocols",
    description:
      "Full support for HTTP/S, TCP, UDP, SMTP, Ping, DNS, and custom SMTP/IMAP checks.",
  },
];

export function UptimeMonitoring() {
  return (
    <section className="bg-[#10201e] py-14 border-t border-[#1c2e24]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-2">
          {/* Block icon */}
          <img 
            src="/assets/block.svg" 
            alt="Uptime Monitoring Icon" 
            width="14" 
            height="14"
            className="w-[14px] h-[14px]"
          />
          <span className="text-white text-[16px] font-semibold tracking-[0.08em] uppercase">
            Uptime Monitoring
          </span>
        </div>

        <p className="text-gray-400 text-[13px] mb-10 max-w-[480px] leading-[1.55]">
          Global edge network ensuring your services are reachable from over 50+ locations
          worldwide.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => {
            return (
              <div
                key={item.title}
                className="bg-[#10221c] border border-[#1c2e24] rounded-lg p-5 hover:border-[#00c896]/25 transition-colors duration-200"
              >
                <div className="w-8 h-8 flex items-center justify-center mb-3.5">
                  <img 
                    src={`/assets/${item.icon}`} 
                    alt={`${item.title} Icon`} 
                    width="20" 
                    height="20"
                    className="w-5 h-5"
                  />
                </div>
                <h3 className="text-white font-semibold text-[17px] mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-[14px] leading-[1.55]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
