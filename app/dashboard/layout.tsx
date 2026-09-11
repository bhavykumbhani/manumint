"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMenuStore } from "@/lib/store";
import { getAppBaseUrl } from "@/lib/utils";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Palette,
  QrCode,
  Store,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, restaurant, logout, isLoading } = useMenuStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not logged in after loading, redirect to login
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Menu Builder", href: "/dashboard/menu", icon: UtensilsCrossed },
    { label: "Design & Style", href: "/dashboard/design", icon: Palette },
    { label: "QR Code", href: "/dashboard/qr", icon: QrCode },
    { label: "Restaurant Settings", href: "/dashboard/restaurant", icon: Store },
    { label: "Account", href: "/dashboard/account", icon: User },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const publicUrl = restaurant ? `${getAppBaseUrl()}/menu/${restaurant.slug}` : "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
              MenuMint
            </span>
            <h1 className="text-sm font-black text-zinc-900 dark:text-zinc-100 truncate">
              {restaurant?.name || "Restaurant"}
            </h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Menu Shortcut Pill */}
        {restaurant && (
          <div className="p-3 mx-3 my-2 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Public Menu</span>
              <span className={`w-2 h-2 rounded-full ${restaurant.published ? "bg-emerald-500" : "bg-amber-500"}`} />
            </div>
            <p className="text-[11px] font-mono text-zinc-400 truncate mb-2">/menu/{restaurant.slug}</p>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Live
              </Button>
            </a>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {user?.full_name || "Owner"}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between z-30">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <UtensilsCrossed className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {restaurant?.name || "MenuMint"}
              </h2>
              <span className="text-[10px] text-zinc-500">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {restaurant && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-xs py-1 px-2.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 space-y-1 animate-in slide-in-from-top duration-150">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center px-2">
              <span className="text-xs text-zinc-500">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
