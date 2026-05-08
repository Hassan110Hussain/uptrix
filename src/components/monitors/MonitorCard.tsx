"use client";

import React from "react";
import { Edit2, Trash2, Power, ExternalLink, Clock, RefreshCw } from "lucide-react";
import { Monitor } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface MonitorCardProps {
  monitor: Monitor;
  onEdit: (monitor: Monitor) => void;
  onDelete: (monitor: Monitor) => void;
  onToggle: (monitor: Monitor) => void;
}

export function MonitorCard({
  monitor,
  onEdit,
  onDelete,
  onToggle,
}: MonitorCardProps) {
  return (
    <div className="bg-[#0d1710] border border-[#1a2e24] rounded-xl p-5 hover:border-[#2a4035] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              monitor.isActive
                ? "bg-[#00c896] shadow-[0_0_6px_rgba(0,200,150,0.6)]"
                : "bg-[#2a4035]"
            }`}
            aria-label={monitor.isActive ? "Active" : "Inactive"}
          />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {monitor.name}
            </h3>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3a5545] text-xs hover:text-[#00c896] transition-colors flex items-center gap-1 truncate"
            >
              {monitor.url}
              <ExternalLink size={9} className="shrink-0" />
            </a>
          </div>
        </div>
        <Badge variant={monitor.isActive ? "success" : "default"}>
          {monitor.isActive ? "Active" : "Paused"}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[#0a1209] border border-[#1a2e24] rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#3a5545] mb-0.5 uppercase tracking-wide">Method</p>
          <p className="text-xs font-semibold text-[#00c896]">{monitor.method}</p>
        </div>
        <div className="bg-[#0a1209] border border-[#1a2e24] rounded-lg px-3 py-2">
          <p className="text-[10px] text-[#3a5545] mb-0.5 uppercase tracking-wide">Status</p>
          <p className="text-xs font-semibold text-white">{monitor.expectedStatusCode}</p>
        </div>
        <div className="bg-[#0a1209] border border-[#1a2e24] rounded-lg px-3 py-2 flex items-start gap-1.5">
          <RefreshCw size={10} className="text-[#3a5545] mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-[#3a5545] mb-0.5 uppercase tracking-wide">Interval</p>
            <p className="text-xs font-semibold text-white">
              {monitor.interval >= 3600
                ? `${monitor.interval / 3600}h`
                : monitor.interval >= 60
                ? `${monitor.interval / 60}m`
                : `${monitor.interval}s`}
            </p>
          </div>
        </div>
        <div className="bg-[#0a1209] border border-[#1a2e24] rounded-lg px-3 py-2 flex items-start gap-1.5">
          <Clock size={10} className="text-[#3a5545] mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-[#3a5545] mb-0.5 uppercase tracking-wide">Timeout</p>
            <p className="text-xs font-semibold text-white">
              {monitor.timeout / 1000}s
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#2a4035]">
          {formatDate(monitor.createdAt)}
        </p>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onToggle(monitor)}
            className={`p-1.5 rounded-md transition-colors ${
              monitor.isActive
                ? "text-yellow-500/70 hover:bg-yellow-500/10 hover:text-yellow-400"
                : "text-[#00c896]/70 hover:bg-[#00c896]/10 hover:text-[#00c896]"
            }`}
            title={monitor.isActive ? "Pause monitor" : "Activate monitor"}
            aria-label={monitor.isActive ? "Pause monitor" : "Activate monitor"}
          >
            <Power size={14} />
          </button>
          <button
            onClick={() => onEdit(monitor)}
            className="p-1.5 rounded-md text-[#3a5545] hover:text-[#00c896] hover:bg-[#00c896]/10 transition-colors"
            title="Edit monitor"
            aria-label="Edit monitor"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(monitor)}
            className="p-1.5 rounded-md text-[#3a5545] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete monitor"
            aria-label="Delete monitor"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
