"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Restaurant } from "@/types";
import { getAppBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Download, Copy, ExternalLink, Printer, Sparkles, Smartphone, Check } from "lucide-react";

interface QRCodeViewProps {
  restaurant: Restaurant;
}

export function QRCodeView({ restaurant }: QRCodeViewProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const standeeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${getAppBaseUrl()}/menu/${restaurant.slug}`;

  useEffect(() => {
    if (publicUrl) {
      // Generate preview QR
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, publicUrl, {
          width: 280,
          margin: 2,
          color: {
            dark: "#09090b",
            light: "#ffffff",
          },
        });
      }

      // Generate standee card QR
      if (standeeCanvasRef.current) {
        QRCode.toCanvas(standeeCanvasRef.current, publicUrl, {
          width: 220,
          margin: 1,
          color: {
            dark: "#09090b",
            light: "#ffffff",
          },
        });
      }
    }
  }, [publicUrl]);

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast("Menu link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPNG = async (size = 512) => {
    try {
      const url = await QRCode.toDataURL(publicUrl, { width: size, margin: 2 });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${restaurant.slug}-qr-${size}px.png`;
      a.click();
      toast(`Downloaded ${size}px QR code!`, "success");
    } catch {
      toast("Failed to download QR code", "error");
    }
  };

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: QR Preview & Controls */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Digital Menu QR Code</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Permanent QR code for table stands, flyers, and menus</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                restaurant.published 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              }`}>
                {restaurant.published ? "Active & Live" : "Draft Status"}
              </span>
            </div>

            {/* Canvas */}
            <div className="flex flex-col items-center justify-center my-6 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="p-3 bg-white rounded-2xl shadow-md border border-zinc-200">
                <canvas ref={canvasRef} className="max-w-full h-auto block" />
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-3 text-center break-all max-w-sm">
                {publicUrl}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 px-3.5 py-2 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-none select-all"
              />
              <Button variant="outline" size="sm" onClick={copyUrl} className="shrink-0">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Button variant="primary" onClick={() => downloadPNG(512)} className="w-full">
                <Download className="w-4 h-4 mr-1.5" />
                Download PNG
              </Button>
              <Button variant="outline" onClick={() => downloadPNG(1024)} className="w-full">
                <Download className="w-4 h-4 mr-1.5" />
                High-Res (1024px)
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Printable Table Standee Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Printable Table Standee</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Ready-to-print acrylic standee card design</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handlePrintStandee}>
                <Printer className="w-4 h-4 mr-1.5" />
                Print Standee
              </Button>
            </div>

            {/* Visual Card Mockup (Printable Area) */}
            <div className="my-6 flex justify-center">
              <div
                id="printable-standee"
                className="w-72 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 text-zinc-900 p-6 rounded-3xl border-2 border-zinc-200 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Decorative Top Pill */}
                <div className="w-12 h-1 bg-zinc-300 rounded-full mb-4" />

                {restaurant.logo_url && (
                  <img
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm mb-2"
                  />
                )}

                <h4 className="text-xl font-black tracking-tight text-zinc-900">{restaurant.name}</h4>
                <p className="text-[11px] uppercase tracking-widest text-emerald-700 font-semibold mt-0.5">
                  Scan For Digital Menu
                </p>

                {/* QR Code Container */}
                <div className="my-4 p-3 bg-white rounded-2xl shadow-sm border border-zinc-200">
                  <canvas ref={standeeCanvasRef} className="w-44 h-44 block" />
                </div>

                {/* Scan Instruction */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 bg-zinc-200/60 px-3 py-1 rounded-full mb-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Point camera to scan</span>
                </div>

                <p className="text-[10px] text-zinc-400">
                  No app or registration required • Instant Menu
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-200/80 w-full flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Table No. ___</span>
                  <span>MenuMint</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <strong>Permanent QR Guarantee:</strong> You can update dishes, change prices from ₹30 to ₹35, or add new categories anytime. This printed QR code never expires or changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
