import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[#8aab98] mb-1.5 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-md bg-[#0a1209] border text-white placeholder-[#3a5545] text-sm",
          "focus:outline-none focus:ring-1 focus:ring-[#00c896] focus:border-[#00c896]",
          "transition-colors duration-200",
          error
            ? "border-red-500/60 focus:ring-red-500 focus:border-red-500"
            : "border-[#1a2e24] hover:border-[#2a4035]",
          props.disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[#3a5545]">{helperText}</p>
      )}
    </div>
  );
}
