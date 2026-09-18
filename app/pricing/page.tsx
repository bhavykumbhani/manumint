"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { PricingSchema } from "@/components/seo/structured-data";
import { trackInitiateCheckout } from "@/lib/meta-pixel";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      <PricingSchema />
      {/* Navbar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Pricing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl font-black mt-2">Pick the plan that suits your café</h1>
          <p className="text-sm text-zinc-500 mt-2">
            No hidden fees. Change or cancel anytime. All prices in Indian Rupee (₹).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Starter Tier */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Starter Tier
              </span>
              <h3 className="text-xl font-bold mt-1">Free Forever</h3>
              <p className="text-xs text-zinc-500 mt-1">For single kiosks and food trucks starting out</p>

              <div className="my-6">
                <span className="text-4xl font-black">₹0</span>
                <span className="text-xs text-zinc-400 ml-1">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  1 Restaurant Menu
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Up to 25 Dishes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Standard QR Code Download
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Veg / Non-Veg / Egg Badges
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Instant Sold Out Toggles
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link href="/signup" onClick={() => trackInitiateCheckout("Starter Tier", 0)}>
                <Button variant="outline" className="w-full font-bold">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-emerald-500 shadow-xl relative flex flex-col justify-between ring-1 ring-emerald-500/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Most Popular
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Pro Restaurateur
              </span>
              <h3 className="text-xl font-bold mt-1">Unlimited Pro</h3>
              <p className="text-xs text-zinc-500 mt-1">Everything a busy café or restaurant needs</p>

              <div className="my-6">
                <span className="text-4xl font-black">₹499</span>
                <span className="text-xs text-zinc-400 ml-1">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Unlimited Dishes & Categories
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  All 9 Designer Menu Templates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  High-Resolution (1024px) QR Export
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Printable Branded Acrylic Standee
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  WhatsApp & Instagram Ordering Links
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Custom Brand Colors
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link href="/signup" onClick={() => trackInitiateCheckout("Pro Tier", 499)}>
                <Button variant="primary" className="w-full font-bold shadow-md">
                  Get Pro Plan
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Hospitality Chains
              </span>
              <h3 className="text-xl font-bold mt-1">Multi-Outlet</h3>
              <p className="text-xs text-zinc-500 mt-1">For multi-location dining groups and franchises</p>

              <div className="my-6">
                <span className="text-4xl font-black">₹1,499</span>
                <span className="text-xs text-zinc-400 ml-1">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Multiple Outlets / Branches
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Table-Specific QR Ordering
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Custom Domain Support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Dedicated Concierge Support
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link href="/signup" onClick={() => trackInitiateCheckout("Enterprise Tier", 1499)}>
                <Button variant="secondary" className="w-full font-bold">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
        ManuMaker SaaS • Designed for Indian Cafés & Restaurants
      </footer>
    </div>
  );
}
