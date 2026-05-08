"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Monitor, Activity, AlertCircle, PauseCircle, ArrowRight, LayoutDashboard } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MonitorCard } from "@/components/monitors/MonitorCard";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { monitorApi } from "@/lib/api";
import { Monitor as MonitorType, ApiResponse, MonitorListResponse } from "@/types";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const { toasts, dismissToast, success, error: toastError } = useToast();

  const [monitors, setMonitors] = useState<MonitorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchMonitors = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await monitorApi.getList({ limit: 5, offset: 1 }, token) as ApiResponse<MonitorListResponse>;
      setMonitors(res.data.records);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load monitors");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  async function handleToggle(monitor: MonitorType) {
    if (!token) return;
    try {
      await monitorApi.toggleMonitor(monitor._id, token);
      setMonitors((prev) =>
        prev.map((m) =>
          m._id === monitor._id ? { ...m, isActive: !m.isActive } : m
        )
      );
      success(`Monitor ${monitor.isActive ? "paused" : "activated"}`);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to toggle monitor");
    }
  }

  const activeCount = monitors.filter((m) => m.isActive).length;
  const pausedCount = monitors.filter((m) => !m.isActive).length;

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here&apos;s an overview of your monitors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Monitors"
          value={monitors.length}
          icon={Monitor}
          color="default"
        />
        <StatsCard
          title="Active"
          value={activeCount}
          icon={Activity}
          color="green"
          description="Currently monitoring"
        />
        <StatsCard
          title="Paused"
          value={pausedCount}
          icon={PauseCircle}
          color="yellow"
          description="Not checking"
        />
      </div>

      {/* Recent Monitors */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Monitors</h2>
        <Link
          href="/dashboard/monitors"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : fetchError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">{fetchError}</p>
        </div>
      ) : monitors.length === 0 ? (
        <div className="bg-[#0d1710] border border-[#1a2e24] rounded-xl p-12 text-center">
          <Monitor size={40} className="text-[#2a4035] mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No monitors yet</h3>
          <p className="text-[#4a7060] text-sm mb-6">
            Add your first monitor to start tracking uptime.
          </p>
          <Link
            href="/dashboard/monitors"
            className="inline-flex items-center gap-2 bg-[#00c896] hover:bg-[#00b386] text-[#080e0b] text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            Add Monitor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {monitors.map((monitor) => (
            <MonitorCard
              key={monitor._id}
              monitor={monitor}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </>
  );
}
