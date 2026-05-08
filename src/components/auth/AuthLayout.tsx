import React from "react";
import Link from "next/link";
import { UptrixLogo } from "@/components/ui/UptrixLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#080e0b] flex flex-col">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,200,150,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white font-semibold text-lg"
        >
          <UptrixLogo size={22} />
          Uptrix
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-[#0d1710] border border-[#1a2e24] rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
              <p className="text-[#5a8070] text-sm">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
