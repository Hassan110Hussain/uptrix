"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { validateEmail, validatePassword } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Enter a valid email";
    const pwdError = validatePassword(form.password);
    if (!form.password) newErrors.password = "Password is required";
    else if (pwdError) newErrors.password = pwdError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authApi.register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });
      router.push(`/auth/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#10221c' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00c896] rounded-lg flex items-center justify-center">
            <img 
              src="/assets/rocket.svg" 
              alt="Uptrix Logo" 
              width="20" 
              height="20"
              className="w-5 h-5"
            />
          </div>
          <span className="text-white font-semibold text-lg">Uptrix</span>
        </Link>
        <span className="text-gray-400 text-sm">Join the next generation of builders</span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md my-20">
          <div className="border border-[#1a3a24] rounded-2xl p-8" style={{ backgroundColor: '#10221c' }}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-[#00c896] text-sm">Join Uptrix today and start building.</p>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-[#00c896] text-xs font-semibold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border border-[#1a3a24] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00c896] focus:outline-none transition-colors"
                    required
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#00c896] text-xs font-semibold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border border-[#1a3a24] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#00c896] focus:outline-none transition-colors"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#00c896] text-xs font-semibold uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00c896] w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-transparent border border-[#1a3a24] rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:border-[#00c896] focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00c896] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
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
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <span className="text-gray-400 text-sm">Already have an account? </span>
                <Link href="/auth/login" className="text-[#00c896] hover:text-[#00b888] text-sm font-medium transition-colors">
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-gray-500 text-xs">© 2024 Uptrix Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
