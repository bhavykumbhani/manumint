"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMenuStore } from "@/lib/store";
import { getAppBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  UtensilsCrossed,
  Layers,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Smartphone,
  Palette,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { restaurant, categories, items, publishRestaurant, isLoading } = useMenuStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-zinc-400">Loading your dashboard...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-200 dark:border-zinc-800 text-center max-w-lg mx-auto shadow-sm my-12 animate-fade-in-up">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Welcome to MenuMint!</h2>
        <p className="text-xs text-zinc-500 mt-2 mb-6 max-w-sm mx-auto leading-relaxed">
          Your account is active, but you haven&apos;t set up your restaurant profile and menu yet. It only takes 2 minutes!
        </p>
        <Link href="/onboarding">
          <Button variant="primary" size="lg" className="w-full shadow-md font-bold">
            <Sparkles className="w-4 h-4 mr-2" />
            Set Up My Restaurant (2 mins)
          </Button>
        </Link>
      </div>
    );
  }

  const publicUrl = `${getAppBaseUrl()}/menu/${restaurant.slug}`;
  const visibleItems = items.filter((i) => i.is_visible);
  const availableItems = items.filter((i) => i.is_available);

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast("Menu link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const res = await publishRestaurant();
      if (res.success) {
        toast("Your menu is now published and LIVE!", "success");
      } else {
        toast(res.error || "Cannot publish menu", "error");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Status Hero */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {restaurant.name}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                restaurant.published
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              }`}
            >
              {restaurant.published ? "● Live on Web" : "○ Draft Mode"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">
            {restaurant.description || "Artisanal digital restaurant menu and instant QR code."}
          </p>

          {/* Public Link Bar */}
          <div className="mt-4 flex items-center gap-2 max-w-md">
            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 truncate">
              {publicUrl}
            </span>
            <Button variant="outline" size="sm" onClick={copyPublicUrl} className="shrink-0">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Status Action */}
        <div className="shrink-0 flex flex-col sm:items-end gap-2">
          {!restaurant.published ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handlePublish}
              isLoading={isPublishing}
              className="shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Publish Menu Now
            </Button>
          ) : (
            <Link href="/dashboard/qr">
              <Button variant="primary" size="lg" className="shadow-md">
                <QrCode className="w-4 h-4 mr-2" />
                View & Print QR
              </Button>
            </Link>
          )}
          <span className="text-[11px] text-zinc-400">
            {restaurant.published
              ? "Updating dishes updates live menu automatically"
              : "Menu will be visible once published"}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Menu Dishes</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{items.length}</p>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            {availableItems.length} active • {items.length - availableItems.length} sold out
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Categories</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">{categories.length}</p>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">Structured sections</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Active Template</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2 capitalize">
            {restaurant.template_key.replace("_", " ")}
          </p>
          <Link href="/dashboard/design" className="text-[11px] text-emerald-600 font-semibold mt-0.5 block hover:underline">
            Change theme →
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Menu Views</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">142</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            ↑ +18% this week
          </span>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/menu"
          className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Menu Builder
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Add dishes, update Indian Rupee (₹) prices, toggle Veg/Non-Veg indicators, and preview live on phone.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            Open Menu Builder <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/design"
          className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Style & Design
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Choose from 4 templates: Minimal, Café, Modern Dark, or Elegant. Set branding colors.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
            Customize Look <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          href="/dashboard/qr"
          className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              QR Code & Standee
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Download high-res permanent QR codes and print branded table cards for your venue.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            Manage QR Code <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
