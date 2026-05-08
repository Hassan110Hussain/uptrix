"use client";

import React, { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, RotateCcw, Eye, EyeOff, Lock, Shield, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { checkPassword } from "@/lib/utils";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email] = useState(emailFromQuery);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const updateOtp = (index: number, value: string) => {
    // Only allow numeric characters and filter out any non-numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Prevent any input longer than 1 character
    if (numericValue.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto-focus next input only if we have a valid numeric value
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Prevent non-numeric keys except backspace, delete, arrow keys, and tab
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumeric = /^[0-9]$/.test(e.key);
    
    if (!isNumeric && !allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }
    
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

  async function handleResendCode() {
    if (!email) return;
    try {
      await authApi.forgotPassword({ email: email });
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to resend code");
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      newErrors.otp = "Please enter the complete 6-digit code";
    }
    
    const pwdError = checkPassword(newPassword);
    if (!newPassword) newErrors.newPassword = "Password is required";
    else if (pwdError) newErrors.newPassword = pwdError;
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: email,
        otp: otp.join(""),
        newPassword: newPassword,
      });
      router.push("/auth/login?reset=success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#10221c' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700/30">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/assets/reset.svg" 
            alt="Uptrix Logo" 
            width="28" 
            height="28"
            className="w-7 h-7"
          />
          <span className="text-white font-semibold text-lg">Uptrix</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
            Help Center
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
            Privacy Policy
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md my-20">
          <div className="text-center space-y-8 p-8 rounded-2xl" style={{ backgroundColor: '#101d22' }}>
            {/* Reset Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <img 
                  src="/assets/arrloc.svg" 
                  alt="Reset Password Icon" 
                  width="48" 
                  height="48"
                  className="w-12 h-12"
                />
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-3">Reset Password</h1>
              <p className="text-gray-400 text-sm">
                Secure your account by updating your credentials below.
              </p>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6 text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address Display */}
              <div className="text-left">
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                  <div className="w-full bg-[#0a1a0f] border border-[#1a3a24] rounded-lg pl-10 pr-4 py-3 text-gray-300 text-sm">
                    {email || "name@company.com"}
                  </div>
                </div>
              </div>

              {/* Verification Code */}
              <div className="text-left">
                <label className="block text-gray-400 text-sm font-medium mb-3">
                  Verification Code
                </label>
                <div className="flex justify-center gap-4 mb-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => updateOtp(index, e.target.value)}
                      onKeyDown={(e) => onKeyDown(index, e)}
                      onPaste={handlePaste}
                      onInput={(e) => {
                        // Additional safeguard to prevent non-numeric input
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, '');
                      }}
                      autoComplete="one-time-code"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-12 h-12 bg-[#0a1a0f] border border-[#1a3a24] rounded-lg text-center text-white text-lg font-semibold focus:border-[#00c896] focus:outline-none transition-colors"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-gray-400 text-xs">We sent a 6-digit code to your email. </span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-[#00c896] hover:text-[#00b888] text-xs transition-colors"
                  >
                    Resend code
                  </button>
                </div>
                {errors.otp && <p className="text-red-400 text-xs mt-1 text-center">{errors.otp}</p>}
              </div>

              {/* New Credentials Section */}
              <div className="pt-4">
                <div className="text-center mb-4">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">New Credentials</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#0a1a0f] border border-[#1a3a24] rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 text-sm focus:border-[#00c896] focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00c896] transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#0a1a0f] border border-[#1a3a24] rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 text-sm focus:border-[#00c896] focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00c896] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00c896] hover:bg-[#00b888] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="pt-6 -m-8 mt-6">
                <Link 
                  href="/auth/login" 
                  className="w-full text-gray-400 hover:text-gray-300 text-sm transition-colors flex items-center justify-center gap-1 px-8 py-6 rounded-b-2xl"
                  style={{ backgroundColor: '#17222d' }}
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Security Badges */}
      <div className="flex justify-center items-center gap-6 py-4">
        <div className="flex items-center gap-1 text-green-400 text-xs">
          <CheckCircle className="w-3 h-3" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1 text-green-400 text-xs">
          <Shield className="w-3 h-3" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
