"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MonitorFormData, Monitor } from "@/types";
import { validateUrl } from "@/lib/utils";

interface MonitorFormProps {
  initialData?: Partial<Monitor>;
  onSubmit: (data: MonitorFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel?: string;
}

const METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
];

const INTERVAL_OPTIONS = [
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "300", label: "5 minutes" },
  { value: "600", label: "10 minutes" },
  { value: "1800", label: "30 minutes" },
  { value: "3600", label: "1 hour" },
];

const TIMEOUT_OPTIONS = [
  { value: "3000", label: "3 seconds" },
  { value: "5000", label: "5 seconds" },
  { value: "10000", label: "10 seconds" },
  { value: "30000", label: "30 seconds" },
];

export function MonitorForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = "Save Monitor",
}: MonitorFormProps) {
  const [form, setForm] = useState<MonitorFormData>({
    name: initialData?.name || "",
    url: initialData?.url || "",
    method: initialData?.method || "GET",
    expectedStatusCode: initialData?.expectedStatusCode || 200,
    interval: initialData?.interval || 60,
    timeout: initialData?.timeout || 5000,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Monitor name is required";
    if (!form.url.trim()) newErrors.url = "URL is required";
    else if (!validateUrl(form.url)) newErrors.url = "Enter a valid URL (include https://)";
    if (!form.expectedStatusCode || form.expectedStatusCode < 100 || form.expectedStatusCode > 599)
      newErrors.expectedStatusCode = "Enter a valid HTTP status code (100-599)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Monitor Name"
        type="text"
        placeholder="e.g. Production API"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        required
      />

      <Input
        label="URL"
        type="url"
        placeholder="https://api.example.com/health"
        value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })}
        error={errors.url}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Method"
          value={form.method}
          onChange={(e) =>
            setForm({ ...form, method: e.target.value as "GET" | "POST" })
          }
          options={METHOD_OPTIONS}
        />

        <Input
          label="Expected Status Code"
          type="number"
          placeholder="200"
          value={String(form.expectedStatusCode)}
          onChange={(e) =>
            setForm({ ...form, expectedStatusCode: parseInt(e.target.value) || 200 })
          }
          error={errors.expectedStatusCode}
          min={100}
          max={599}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Check Interval"
          value={String(form.interval)}
          onChange={(e) =>
            setForm({ ...form, interval: parseInt(e.target.value) })
          }
          options={INTERVAL_OPTIONS}
        />

        <Select
          label="Timeout"
          value={String(form.timeout)}
          onChange={(e) =>
            setForm({ ...form, timeout: parseInt(e.target.value) })
          }
          options={TIMEOUT_OPTIONS}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
