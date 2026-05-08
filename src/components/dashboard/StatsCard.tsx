import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "green" | "red" | "yellow" | "default";
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color = "default",
  description,
}: StatsProps) {
  const colorMap = {
    green: {
      iconBg: "bg-[#00c896]/10 border-[#00c896]/20",
      iconColor: "text-[#00c896]",
      valueColor: "text-[#00c896]",
    },
    red: {
      iconBg: "bg-red-500/10 border-red-500/20",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
    yellow: {
      iconBg: "bg-yellow-500/10 border-yellow-500/20",
      iconColor: "text-yellow-400",
      valueColor: "text-yellow-400",
    },
    default: {
      iconBg: "bg-[#1a2e24] border-[#2a4035]",
      iconColor: "text-[#5a8070]",
      valueColor: "text-white",
    },
  };

  const colors = colorMap[color];

  return (
    <div className="bg-[#0d1710] border border-[#1a2e24] rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#4a7060] uppercase tracking-wide mb-1.5">{title}</p>
          <p className={cn("text-3xl font-bold", colors.valueColor)}>{value}</p>
          {description && (
            <p className="text-xs text-[#3a5545] mt-1">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border",
            colors.iconBg
          )}
        >
          <Icon size={17} className={colors.iconColor} />
        </div>
      </div>
    </div>
  );
}
