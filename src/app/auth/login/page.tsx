"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { validateEmail } from "@/lib/utils";
import { ApiResponse, User } from "@/types";

interface LoginData {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authApi.login({
        email: form.email,
        password: form.password,
      }) as ApiResponse<LoginData>;

      const user: User = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
      };
      login(res.data.accessToken, user);
      router.push("/dashboard");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#10221c' }}>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center space-y-8">
            {/* Logo and Header */}
            <div className="space-y-4 mt-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <img 
                  src="/assets/Overlay.svg" 
                  alt="Uptrix Logo" 
                  width="48" 
                  height="48"
                  className="w-12 h-12"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Uptrix</h1>
                <p className="text-gray-400 text-sm">Welcome back to your dashboard</p>
              </div>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Container with Border */}
              <div className="border border-[#1a3a24] rounded-2xl p-6" style={{ backgroundColor: '#101d24' }}>
                {/* Email */}
                <div className="text-left mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#0a1a0f] border border-[#1a3a24] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00c896] focus:outline-none transition-colors"
                    required
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="text-left mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-300 text-sm font-medium">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-[#00c896] hover:text-[#00b888] text-sm transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-[#0a1a0f] border border-[#1a3a24] rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-[#00c896] focus:outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00c896] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Keep me logged in */}
                <div className="flex items-center text-left mb-6">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="w-4 h-4 text-[#00c896] border border-[#1a3a24] rounded focus:ring-[#00c896] focus:ring-1"
                    style={{ backgroundColor: '#101d24' }}
                  />
                  <label htmlFor="keepLoggedIn" className="ml-3 text-sm text-gray-400">
                    Keep me logged in
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00c896] hover:bg-[#00b888] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* OR Continue with */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1a3a24]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-400" style={{ backgroundColor: '#101d24' }}>OR CONTINUE WITH</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0a1a0f] border border-[#1a3a24] rounded-lg text-white hover:border-[#00c896] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0a1a0f] border border-[#1a3a24] rounded-lg text-white hover:border-[#00c896] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.11.221.082.402-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center pt-6">
                <span className="text-gray-400 text-sm">Don't have an account? </span>
                <Link href="/auth/register" className="text-[#00c896] hover:text-[#00b888] text-sm font-medium transition-colors">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/privacy" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-gray-400 text-xs transition-colors">
            Contact Support
          </Link>
        </div>
      </footer>
    </div>
  );
}
