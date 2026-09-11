"use client";

import React, { useState } from "react";
import { useMenuStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, LogOut, Users, Key, Mail, Check } from "lucide-react";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, logout, switchAccount } = useMenuStore();
  const { toast } = useToast();

  const [testEmail, setTestEmail] = useState("");

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSwitchToTestUser = (email: string, name: string) => {
    switchAccount(email, name);
    toast(`Switched active account to ${name} (${email})`, "info");
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            Account & Security
          </h1>
          <p className="text-xs text-zinc-500">
            Manage owner profile, authentication sessions, and tenant isolation.
          </p>
        </div>
      </div>

      {/* Profile Info Box */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Owner Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              {user.full_name}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Email Address</label>
            <p className="text-sm font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              {user.email}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">User Identifier (UUID / ID)</label>
          <p className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
            {user.id}
          </p>
        </div>
      </div>

      {/* Multi-Tenant Account Switching (For Verification & Testing) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Tenant Isolation & Account Switcher
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verify multi-tenant row level security. Switch to another owner account to verify that User B cannot edit Cafe Aroma.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div
            onClick={() => handleSwitchToTestUser("owner@cafearoma.in", "Aarav Sharma")}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
              user.email === "owner@cafearoma.in"
                ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Cafe Aroma Owner (User A)</span>
              {user.email === "owner@cafearoma.in" && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-mono">owner@cafearoma.in</p>
          </div>

          <div
            onClick={() => handleSwitchToTestUser("rival@bistro.in", "Rohit Verma")}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
              user.email === "rival@bistro.in"
                ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Second Restaurant (User B)</span>
              {user.email === "rival@bistro.in" && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-mono">rival@bistro.in</p>
          </div>
        </div>
      </div>

      {/* Danger Zone / Logout */}
      <div className="bg-rose-50/60 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">Sign Out</h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
            Terminate active session on this device.
          </p>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-1.5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
