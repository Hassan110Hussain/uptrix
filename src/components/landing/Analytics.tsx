import React from "react";

const analyticsItems = [
  {
    icon: "grap.svg", // Custom SVG for Uptime Trends
    title: "Uptime Trends",
    description:
      "Visualize your monitoring data with easy-to-read charts and spot recurring downtime patterns.",
  },
  {
    icon: "speedo.svg", // Custom SVG for Latency Map
    title: "Latency Map",
    description:
      "See where slowness originates globally with geographical latency breakdowns and regional options.",
  },
  {
    icon: "arrow.svg", // Custom SVG for Baseline Comparison
    title: "Baseline Comparison",
    description:
      "Compare current performance against historical baselines to detect silent degradation.",
  },
  {
    icon: "analytic.svg", // Custom SVG for Analytics API
    title: "Analytics API",
    description:
      "Programmatically retrieve metrics, statuses, or custom interval analytics via our REST API.",
  },
];

export function Analytics() {
  return (
    <section className="bg-[#10221c] py-14 border-t border-[#1c2e24]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[22px] sm:text-[26px] font-bold text-white mb-2.5">
            Actionable Analytics
          </h2>
          <p className="text-[#5a7a68] text-[13px] max-w-[420px] mx-auto leading-[1.6]">
            Turn raw monitoring data into business insights with our advanced and
            visual analytics tools.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsItems.map((item) => {
            return (
              <div
                key={item.title}
                className="bg-[#10221c] rounded-lg p-5 hover:bg-[#0d1510] transition-colors duration-200"
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
                <h3 className="text-white font-semibold text-[13px] mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#5a7a68] text-[12px] leading-[1.55]">
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
