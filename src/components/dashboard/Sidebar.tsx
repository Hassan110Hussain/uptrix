"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { UptrixLogo } from "@/components/ui/UptrixLogo";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Monitors", href: "/dashboard/monitors", icon: Monitor },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#1a2e24]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white font-semibold text-lg"
          onClick={() => setIsMobileOpen(false)}
        >
          <UptrixLogo size={22} />
          Uptrix
        </Link>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-0.5"
        aria-label="Dashboard navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#00c896]/10 text-[#00c896] border border-[#00c896]/20"
                  : "text-[#5a8070] hover:text-white hover:bg-[#1a2e24]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[#1a2e24]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 bg-[#00c896]/10 border border-[#00c896]/20 rounded-full flex items-center justify-center text-[#00c896] text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-[#3a5545] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-[#5a8070] hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0d1710] border-r border-[#1a2e24] h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0d1710] border-b border-[#1a2e24] px-4 py-3 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white font-semibold text-base"
        >
          <UptrixLogo size={20} />
          Uptrix
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#5a8070] hover:text-white transition-colors"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-56 bg-[#0d1710] border-r border-[#1a2e24] h-full">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
