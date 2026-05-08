"use client";

import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm w-full",
        "animate-in slide-in-from-right-5 duration-300",
        toast.type === "success"
          ? "bg-[#0d1710] border-[#00c896]/30 text-[#00c896]"
          : "bg-[#0d1710] border-red-500/30 text-red-400"
      )}
      role="alert"
    >
      {toast.type === "success" ? (
        <CheckCircle size={16} className="mt-0.5 shrink-0" />
      ) : (
        <XCircle size={16} className="mt-0.5 shrink-0" />
      )}
      <p className="text-sm text-[#8aab98] flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#3a5545] hover:text-[#8aab98] transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
