"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { UtensilsCrossed, ArrowRight, Sparkles, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useMenuStore();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res.success) {
        toast("Welcome back!", "success");
        router.push("/dashboard");
      } else {
        setError(res.error || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    try {
      setIsLoading(true);
      await login("owner@cafearoma.in", "demo123");
      toast("Logged in as Cafe Aroma Owner!", "success");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <Logo size="lg" className="mb-2" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            Restaurant Owner Login
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your menu items, pricing, QR code, and design
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourrestaurant.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleQuickDemoLogin}
              className="w-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-emerald-600" />
              1-Click Demo Login (Cafe Aroma)
            </Button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-600 hover:underline">
            Create Your Menu Free
          </Link>
        </p>
      </div>
    </div>
  );
}
