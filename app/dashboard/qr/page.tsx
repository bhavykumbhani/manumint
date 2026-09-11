"use client";

import React from "react";
import Link from "next/link";
import { useMenuStore } from "@/lib/store";
import { QRCodeView } from "@/components/qr/qr-code-view";
import { Button } from "@/components/ui/button";
import { QrCode, Sparkles } from "lucide-react";

export default function QRManagementPage() {
  const { restaurant } = useMenuStore();

  if (!restaurant) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm my-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Restaurant Configured</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-5">
          Please set up your restaurant profile and menu first to generate your permanent QR code.
        </p>
        <Link href="/onboarding">
          <Button variant="primary" size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Set Up Restaurant
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            QR Code & Table Standee
          </h1>
          <p className="text-xs text-zinc-500">
            Download your restaurant&apos;s permanent QR code in PNG/high-res and print acrylic table cards.
          </p>
        </div>
      </div>
      <QRCodeView restaurant={restaurant} />
    </div>
  );
}
