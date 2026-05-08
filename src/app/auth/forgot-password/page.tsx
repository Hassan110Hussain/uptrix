"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, Key } from "lucide-react";
import { authApi } from "@/lib/api";
import { isValidEmail } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    if (!email) { setError("Email is required"); return false; }
    if (!isValidEmail(email)) { setError("Enter a valid email"); return false; }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#10221c' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#1a3a24]">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/assets/Overlay.svg" 
            alt="Uptrix Logo" 
            width="28" 
            height="28"
            className="w-7 h-7"
          />
          <span className="text-white font-semibold text-lg">Uptrix</span>
        </Link>
        <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors bg-[#1a3a24] rounded-lg p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md my-20">
          <div className="border border-[#1a3a24] rounded-2xl p-8" style={{ backgroundColor: '#162f27' }}>
            {/* Key Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <img 
                  src="/assets/key.svg" 
                  alt="Key Icon" 
                  width="48" 
                  height="48"
                  className="w-12 h-12"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-3">Forgot password?</h1>
              <p className="text-gray-400 text-sm mb-6">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-[#00c896]/5 border-l-4 border-[#00c896] p-4 mb-6 rounded-r-lg">
              <p className="text-gray-300 text-sm">
                We'll send a code to your email to verify your identity. Make sure you have access to this inbox.
              </p>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-[#00c896] text-xs font-semibold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                  <input
                    type="email"
                    placeholder="e.g. name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border border-[#1a3a24] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00c896] focus:outline-none transition-colors"
                    required
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00c896] hover:bg-[#00b888] text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send reset code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Link 
                  href="/auth/login" 
                  className="text-[#00c896] hover:text-[#00b888] text-sm transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-gray-500 text-xs">
          © 2024 Uptrix Identity Solutions. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
