"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, AlertCircle, Monitor as MonitorIcon, SlidersHorizontal } from "lucide-react";
import { MonitorCard } from "@/components/monitors/MonitorCard";
import { MonitorForm } from "@/components/monitors/MonitorForm";
import { DeleteConfirmModal } from "@/components/monitors/DeleteConfirmModal";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ToastContainer } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { monitorApi } from "@/lib/api";
import { Monitor, MonitorData, ApiResponse, MonitorListResponse } from "@/types";
import { useToast } from "@/hooks/useToast";

const METHOD_FILTER_OPTIONS = [
  { value: "", label: "All Methods" },
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Paused" },
];

const LIMIT_OPTIONS = [
  { value: "10", label: "10 per page" },
  { value: "20", label: "20 per page" },
  { value: "50", label: "50 per page" },
];

export default function MonitorsPage() {
  const { token } = useAuth();
  const { toasts, dismissToast, success, error: toastError } = useToast();

  // Data state
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editMonitor, setEditMonitor] = useState<Monitor | null>(null);
  const [deleteMonitor, setDeleteMonitor] = useState<Monitor | null>(null);

  // Action loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMonitors = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await monitorApi.getList(
        {
          offset,
          limit,
          search: search || undefined,
          method: methodFilter || undefined,
          isActive: statusFilter || undefined,
        },
        token
      ) as ApiResponse<MonitorListResponse>;
      setMonitors(res.data.records);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load monitors");
    } finally {
      setIsLoading(false);
    }
  }, [token, offset, limit, search, methodFilter, statusFilter]);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  // Debounced search
  useEffect(() => {
    setOffset(1);
  }, [search, methodFilter, statusFilter]);

  async function create(data: MonitorData) {
    if (!token) return;
    setIsSubmitting(true);
    try {
      await monitorApi.create(data, token);
      success("Monitor created successfully");
      setIsCreateOpen(false);
      fetchMonitors();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to create monitor");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function update(data: MonitorData) {
    if (!token || !editMonitor) return;
    setIsSubmitting(true);
    try {
      await monitorApi.updateMonitor(editMonitor._id, data, token);
      success("Monitor updated successfully");
      setEditMonitor(null);
      fetchMonitors();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update monitor");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function remove() {
    if (!token || !deleteMonitor) return;
    setIsDeleting(true);
    try {
      await monitorApi.deleteMonitor(deleteMonitor._id, token);
      success("Monitor deleted");
      setDeleteMonitor(null);
      fetchMonitors();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete monitor");
    } finally {
      setIsDeleting(false);
    }
  }

  async function toggle(monitor: Monitor) {
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

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Monitor"
        size="lg"
      >
        <MonitorForm
          onSubmit={create}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={isSubmitting}
          submitLabel="Create Monitor"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editMonitor}
        onClose={() => setEditMonitor(null)}
        title="Edit Monitor"
        size="lg"
      >
        <MonitorForm
          initialData={editMonitor || undefined}
          onSubmit={update}
          onCancel={() => setEditMonitor(null)}
          isLoading={isSubmitting}
          submitLabel="Update Monitor"
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        monitor={deleteMonitor}
        isOpen={!!deleteMonitor}
        onClose={() => setDeleteMonitor(null)}
        onConfirm={remove}
        isLoading={isDeleting}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitors</h1>
          <p className="text-gray-400 text-sm mt-1">
            {total} monitor{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Monitor
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#0d1710] border border-[#1a2e24] rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0a1209] border border-[#1a2e24] rounded-md text-white text-sm placeholder-[#3a5545] focus:outline-none focus:ring-1 focus:ring-[#00c896] focus:border-[#00c896]"
            />
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 sm:w-auto"
          >
            <SlidersHorizontal size={15} />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#1a2e24]">
            <Select
              options={METHOD_FILTER_OPTIONS}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              label="Method"
            />
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            />
            <Select
              options={LIMIT_OPTIONS}
              value={String(limit)}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              label="Per Page"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="md" />
        </div>
      ) : fetchError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
          <AlertCircle size={28} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-400 text-sm mb-4">{fetchError}</p>
          <Button variant="secondary" size="sm" onClick={fetchMonitors}>
            Try Again
          </Button>
        </div>
      ) : monitors.length === 0 ? (
        <div className="bg-[#0d1710] border border-[#1a2e24] rounded-xl p-16 text-center">
          <MonitorIcon size={44} className="text-[#2a4035] mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">
            {search || methodFilter || statusFilter
              ? "No monitors match your filters"
              : "No monitors yet"}
          </h3>
          <p className="text-[#4a7060] text-sm mb-6">
            {search || methodFilter || statusFilter
              ? "Try adjusting your search or filters."
              : "Add your first monitor to start tracking uptime."}
          </p>
          {!search && !methodFilter && !statusFilter && (
            <Button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2">
              <Plus size={16} />
              Add Your First Monitor
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {monitors.map((monitor) => (
              <MonitorCard
                key={monitor._id}
                monitor={monitor}
                onEdit={setEditMonitor}
                onDelete={setDeleteMonitor}
                onToggle={toggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Page {offset} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOffset((p) => Math.max(1, p - 1))}
                  disabled={offset === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setOffset((p) => Math.min(totalPages, p + 1))}
                  disabled={offset === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
