"use client";

import React, { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { ApiResponse, User } from "@/types";

interface VerifyData {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const emailFromQuery = searchParams.get("email") || "";

  const [email] = useState(emailFromQuery);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setApiError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp({
        email: email,
        otp: otpString,
      }) as ApiResponse<VerifyData>;

      const user: User = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
      };
      login(res.data.accessToken, user);
      router.push("/dashboard");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setIsResending(true);
    setApiError("");
    try {
      await authApi.forgotPassword({ email: email });
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#10221c' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[#1a3a24]">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/assets/otp.svg" 
            alt="Uptrix Logo" 
            width="28" 
            height="28"
            className="w-7 h-7"
          />
          <span className="text-white font-semibold text-lg">Uptrix</span>
        </Link>
        <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors bg-[#1a3a24] rounded-lg p-2">
          <img 
            src="/assets/but.svg" 
            alt="Close" 
            width="24" 
            height="24"
            className="w-6 h-6"
          />
        </Link>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md my-20">
          <div className="border border-[#1a3a24] rounded-2xl px-8 py-12" style={{ backgroundColor: '#10221c' }}>
            {/* Message Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <img 
                  src="/assets/msg.svg" 
                  alt="Message Icon" 
                  width="48" 
                  height="48"
                  className="w-12 h-12"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-3">Verify OTP</h1>
              <p className="text-gray-400 text-sm mb-6">
                We've sent a 6-digit verification code to your email address. Please enter it below to continue.
              </p>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Verification Email Display */}
              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Verification Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                  <div className="w-full bg-transparent border border-[#1a3a24] rounded-lg pl-10 pr-4 py-3 text-gray-400 text-sm">
                    {email || "alex.design@example.com"}
                  </div>
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 bg-transparent border border-[#1a3a24] rounded-lg text-center text-white text-lg font-semibold focus:border-[#00c896] focus:outline-none transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00c896] hover:bg-[#00b888] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Link */}
              <div className="text-center pt-2">
                <span className="text-gray-400 text-sm">Didn't receive the code? </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#00c896] hover:text-[#00b888] text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              {/* Back to Login */}
              <div className="text-center pt-2">
                <Link 
                  href="/auth/login" 
                  className="text-gray-500 hover:text-gray-400 text-sm transition-colors inline-flex items-center gap-1"
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
          © 2024 Uptrix Inc. All rights reserved. Secure verification powered by Uptrix Auth.
        </p>
      </footer>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  );
}
