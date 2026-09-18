"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  QrCode,
  Sparkles,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Zap,
  Palette,
  ShieldCheck,
  Check,
  ChevronDown,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATE_METAS } from "@/components/menu-templates";
import { FoodIndicator } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { trackLead } from "@/lib/meta-pixel";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-600">
            <a href="#how-it-works" className="hover:text-zinc-950 transition-colors">
              How It Works
            </a>
            <a href="#templates" className="hover:text-zinc-950 transition-colors">
              Templates
            </a>
            <a href="#benefits" className="hover:text-zinc-950 transition-colors">
              Benefits
            </a>
            <Link href="/pricing" className="hover:text-zinc-950 transition-colors">
              Pricing
            </Link>
            <a href="#faq" className="hover:text-zinc-950 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
                Create Your Menu
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              India's #1 Digital Menu & QR Platform for Cafés & Restaurants
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.1]">
              Turn your menu into a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                beautiful QR experience.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 mt-5 max-w-2xl mx-auto leading-relaxed">
              Create your digital menu, customize the design and get a QR code in minutes. Update prices anytime without reprinting your table QR.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm font-bold shadow-lg shadow-emerald-600/20 px-8 py-3.5">
                  Create Your Menu Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/menu/cafe-aroma" target="_blank" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-semibold border-zinc-300">
                  <Smartphone className="w-4 h-4 mr-2 text-emerald-600" />
                  View Live Customer Demo
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Customers need zero apps
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Permanent QR guarantee
              </span>
            </div>
          </div>

          {/* Hero Visual: Side-by-side Admin Editor and Mobile Preview Mockup */}
          <div className="relative max-w-5xl mx-auto rounded-3xl bg-zinc-950 p-3 sm:p-6 shadow-2xl border border-zinc-800">
            <div className="flex items-center justify-between pb-4 px-2 border-b border-zinc-800 text-zinc-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-zinc-400">manumaker.com/dashboard/menu</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">● Live Synchronization</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-center">
              {/* Left Mock Editor */}
              <div className="lg:col-span-7 bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">Menu Builder — Cafe Aroma</h4>
                    <p className="text-[11px] text-zinc-400">Editing category: Hot Beverages</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Auto-saved
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-zinc-850 border border-zinc-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FoodIndicator type="veg" size="sm" />
                      <div>
                        <span className="text-xs font-bold text-white block">Masala Chai</span>
                        <span className="text-[10px] text-zinc-400">Cardamom, ginger & cloves</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-400 font-mono">₹30</span>
                      <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-850 border border-zinc-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FoodIndicator type="veg" size="sm" />
                      <div>
                        <span className="text-xs font-bold text-white block">Cappuccino</span>
                        <span className="text-[10px] text-zinc-400">Dark espresso with steamed velvet foam</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-400 font-mono">₹120</span>
                      <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-850 border border-zinc-700/60 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-2.5">
                      <FoodIndicator type="veg" size="sm" />
                      <div>
                        <span className="text-xs font-bold text-zinc-300 block">Cold Coffee</span>
                        <span className="text-[10px] text-zinc-500">Blended creamy cold coffee</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-zinc-400 font-mono">₹150</span>
                      <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-800">
                        Sold Out
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Price changed? Public URL updates in 0.1s.</span>
                  <span className="text-emerald-400 font-semibold">QR code stays identical ✓</span>
                </div>
              </div>

              {/* Right Phone Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-64 h-[380px] bg-black rounded-[36px] p-2 border-2 border-zinc-700 shadow-2xl relative overflow-hidden flex flex-col">
                  {/* Notch */}
                  <div className="w-16 h-3 bg-black rounded-full mx-auto mb-1" />
                  <div className="flex-1 bg-[#FAF7F2] rounded-[28px] p-3 overflow-hidden text-amber-950 flex flex-col justify-between">
                    <div>
                      <div className="text-center pb-2 border-b border-amber-200/60">
                        <span className="text-xs font-black uppercase tracking-wider block">Cafe Aroma</span>
                        <span className="text-[9px] text-amber-700">Artisanal Café • Indiranagar</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="bg-white p-2 rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <FoodIndicator type="veg" size="sm" />
                            <span className="text-[11px] font-bold">Masala Chai</span>
                          </div>
                          <span className="text-[11px] font-black font-mono text-amber-900">₹30</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-amber-100 shadow-2xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <FoodIndicator type="veg" size="sm" />
                            <span className="text-[11px] font-bold">Cappuccino</span>
                          </div>
                          <span className="text-[11px] font-black font-mono text-amber-900">₹120</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-emerald-600 text-white text-[10px] font-bold py-1 px-2 rounded-full text-center">
                      Point camera to view full menu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-zinc-50 border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 mt-2">
              From zero to table QR in under 5 minutes
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              No design skills or software downloads required. Built for busy hospitality managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Add your dishes</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Add food items, Rupee prices (₹), photos, and official FSSAI Veg / Non-Veg / Egg indicators. Mark Jain or Vegan dietary options with one click.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Choose your style</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pick from 4 distinctive designer templates: Minimal, Café, Modern Dark, or Elegant. Customize colors to match your restaurant interior.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-black text-lg flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Publish & get your QR</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Download your permanent high-resolution QR code and print table standees. Update your menu or prices anytime without reprinting your QR codes!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Curated Hospitality Aesthetics
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 mt-2">
              4 templates designed for every dining style
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              All templates consume your structured data. Switch themes anytime without re-entering dishes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATE_METAS.map((tmpl) => (
              <div
                key={tmpl.key}
                className="rounded-3xl border border-zinc-200 overflow-hidden shadow-xs flex flex-col justify-between bg-zinc-50"
              >
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {tmpl.badge}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 mt-3">{tmpl.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{tmpl.description}</p>
                </div>
                <div className="p-4 bg-white border-t border-zinc-200/80 flex items-center justify-between">
                  <Link href={`/menu/cafe-aroma`} target="_blank" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                    Preview in browser <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Why Restaurateurs Love ManuMaker
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              The smartest menu on your tables
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Zero Apps or Logins",
                desc: "Customers scan the QR and your menu opens instantly in Mobile Safari or Chrome. No friction.",
                icon: Smartphone,
              },
              {
                title: "Permanent QR Code",
                desc: "Change Masala Chai from ₹30 to ₹35 anytime. Your table standees and printed QR codes never need reprinting.",
                icon: QrCode,
              },
              {
                title: "FSSAI Veg / Non-Veg Standard",
                desc: "Full support for official Indian green and red food type dots, plus Jain and Vegan tags.",
                icon: UtensilsCrossed,
              },
              {
                title: "Instant 'Sold Out' Toggles",
                desc: "Ran out of cheesecake? Mark it Sold Out in 2 seconds. Customers see updated availability immediately.",
                icon: Zap,
              },
              {
                title: "Direct WhatsApp Ordering",
                desc: "Customers can tap to message your restaurant directly on WhatsApp for specials or table inquiries.",
                icon: Sparkles,
              },
              {
                title: "Blazing Fast Client Search",
                desc: "Customers type 'paneer' or 'iced' and find dishes across all categories instantly.",
                icon: Search,
              },
            ].map((b, i) => (
              <div key={i} className="bg-zinc-850 p-6 rounded-2xl border border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Got Questions?
            </span>
            <h2 className="text-3xl font-black text-zinc-950 mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "If I change my prices or add new dishes, do I have to reprint my QR codes?",
                a: "Never! Your QR code points to your permanent public restaurant URL (e.g. manumaker.com/menu/cafe-aroma). Whenever you change a price from ₹30 to ₹35 or add a new category, your digital menu updates instantly while the physical QR code on your tables remains unchanged.",
              },
              {
                q: "Do customers need to download an app or create an account?",
                a: "No. Customers point their native camera at the QR code and your menu opens in under 1 second in their default browser (Safari, Chrome). No apps, no downloads, and no account sign-in required.",
              },
              {
                q: "Does ManuMaker support Veg, Non-Veg, and Jain food indicators?",
                a: "Yes! ManuMaker adheres to official FSSAI dietary standards with crisp Veg (green dot in square), Non-Veg (crimson dot/triangle in square), and Egg indicators, along with Jain, Vegan, Spicy, and Bestseller tags.",
              },
              {
                q: "Can I connect my WhatsApp and Instagram accounts?",
                a: "Yes. In your restaurant profile, enter your WhatsApp number and Instagram handle. Customers will see direct quick-action buttons to message your staff or follow your profile.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border border-zinc-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-zinc-900 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 bg-white text-xs text-zinc-600 leading-relaxed border-t border-zinc-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-emerald-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to upgrade your restaurant tables?
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 mt-3 max-w-xl mx-auto leading-relaxed">
            Create your digital menu in minutes. Download your high-resolution QR standee and impress your guests today.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button variant="secondary" size="lg" className="font-bold text-emerald-950 px-8 py-3 shadow-xl">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-950 text-zinc-500 text-xs border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" withLink={false} />
            <span className="text-zinc-400 hidden sm:inline">— Beautiful digital menus. One QR.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-zinc-300">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-zinc-300">
              Owner Sign In
            </Link>
            <Link href="/signup" onClick={() => trackLead("Landing Footer CTA")} className="hover:text-zinc-300">
              Create Menu
            </Link>
          </div>

          <p>© {new Date().getFullYear()} ManuMaker SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
