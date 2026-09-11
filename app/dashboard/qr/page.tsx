"use client";

import React from "react";
import { useMenuStore } from "@/lib/store";
import { QRCodeView } from "@/components/qr/qr-code-view";

export default function QRManagementPage() {
  const { restaurant } = useMenuStore();

  if (!restaurant) {
    return <div className="py-12 text-center text-zinc-400 text-sm">Loading restaurant...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            QR Code & Table Standee
          </h1>
          <p className="text-xs text-zinc-500">
            Download your restaurant's permanent QR code in PNG/high-res and print acrylic table cards.
          </p>
        </div>
      </div>
      <QRCodeView restaurant={restaurant} />
    </div>
  );
}
