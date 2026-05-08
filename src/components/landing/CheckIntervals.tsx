import React from "react";
import { CheckCircle } from "lucide-react";

const stats = [
  { value: "30s", label: "MIN INTERVAL" },
  { value: "2xx", label: "STATUS VALID" },
  { value: "JSON", label: "PAYLOAD CHECKS" },
  { value: "POST", label: "CUSTOM METHODS" },
];

const features = [
  {
    title: "Granular Intervals",
    description:
      "Configure intervals from 30 s to 60 min rules for every single monitor.",
  },
  {
    title: "Smart Status Matching",
    description:
      'Define "2xx" to catch status codes (e.g., allow 401 for auth endpoints, 304).',
  },
  {
    title: "Keyword Assertion",
    description:
      "Ensure exact text or JSON keys are present in the response body.",
  },
];

export function CheckIntervals() {
  return (
    <section className="bg-[#10221c] py-14 border-t border-[#1c2e24]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
          {/* Left — 2×2 stat cards */}
          <div className="grid grid-cols-2 gap-4 max-w-[400px] ml-16">
            {stats.map((s) => (
              <div
                key={s.value}
                className="bg-[#1e293b] border border-[#1c2e24] rounded-lg p-5 flex flex-col items-center justify-center text-center hover:border-[#00c896]/22 transition-colors duration-200 w-[180px] h-[180px]"
              >
                <span className="text-[#00c896] text-[28px] font-bold tracking-tight leading-none mb-1.5">
                  {s.value}
                </span>
                <span className="text-[#3a5a48] text-[10px] font-semibold tracking-[0.1em] uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right — text + feature list */}
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-white mb-2.5 leading-snug">
              Check Intervals &amp; Precision
            </h2>
            <p className="text-[#5a7a68] text-[13px] leading-[1.6] mb-6">
              Precision matters when every second of downtime costs revenue.
              Define exactly how and when we talk to your services.
            </p>

            <ul className="space-y-4">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-2.5">
                  <CheckCircle
                    size={14}
                    className="text-[#00c896] mt-[2px] shrink-0"
                  />
                  <div>
                    <p className="text-white text-[13px] font-semibold mb-0.5 leading-snug">
                      {f.title}
                    </p>
                    <p className="text-[#5a7a68] text-[12px] leading-[1.55]">
                      {f.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
