"use client";

import React, { useState } from "react";
import { useMenuStore } from "@/lib/store";
import { TemplateKey } from "@/types";
import { TEMPLATE_METAS } from "@/components/menu-templates";
import { PhonePreview } from "@/components/dashboard/phone-preview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Check, Sparkles, Palette, Smartphone, SlidersHorizontal } from "lucide-react";

export function DesignView() {
  const { restaurant, categories, items, setTemplate, updateRestaurant } = useMenuStore();
  const { toast } = useToast();

  const [primaryColor, setPrimaryColor] = useState(restaurant?.primary_color || "#10B981");
  const [secondaryColor, setSecondaryColor] = useState(restaurant?.secondary_color || "#047857");
  const [mobileTab, setMobileTab] = useState<"design" | "preview">("design");

  if (!restaurant) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm my-8">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Restaurant Configured</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-5">Please set up your restaurant first to choose a design theme.</p>
        <a href="/onboarding" className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white">
          Set Up Restaurant
        </a>
      </div>
    );
  }

  const handleSelectTemplate = async (key: TemplateKey) => {
    await setTemplate(key);
    toast(`Menu template switched to ${key.replace("_", " ")}!`, "success");
  };

  const handleSaveColors = async () => {
    await updateRestaurant({
      primary_color: primaryColor,
      secondary_color: secondaryColor,
    });
    toast("Branding colors updated!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Mobile Tab Toggle */}
      <div className="lg:hidden flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        <button
          onClick={() => setMobileTab("design")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "design"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <Palette className="w-4 h-4" />
          Style & Branding
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "preview"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Selection & Branding */}
        <div className={`lg:col-span-7 space-y-6 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
          {/* Templates Grid */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Choose Menu Template</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Every template consumes the exact same structured dishes and categories. Switch anytime!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATE_METAS.map((tmpl) => {
                const isSelected = restaurant.template_key === tmpl.key;
                return (
                  <div
                    key={tmpl.key}
                    onClick={() => handleSelectTemplate(tmpl.key)}
                    className={`cursor-pointer rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden group relative ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-850"
                    }`}
                  >
                    {/* Visual Preview Image Banner */}
                    <div className="relative h-32 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={tmpl.previewImage}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wider bg-white/95 dark:bg-zinc-900/90 text-zinc-900 dark:text-white px-2.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                        {tmpl.badge}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" /> Active
                        </div>
                      )}
                      <span className="absolute bottom-2 left-3 text-[11px] font-bold text-white/95 drop-shadow-sm">
                        {tmpl.vibe}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{tmpl.name}</h3>
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{tmpl.description}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                        <span className={`font-semibold text-[11px] ${isSelected ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"}`}>
                          {isSelected ? "✓ Currently Active" : "Click to apply"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Branding & Color Customization */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Brand Colors</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Customize accents to match your restaurant's physical branding and interior.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-zinc-200 dark:border-zinc-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Quick Palettes */}
            <div>
              <span className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                Popular Hospitality Palettes
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Emerald Café", primary: "#10B981", secondary: "#047857" },
                  { name: "Artisan Coffee", primary: "#D97706", secondary: "#92400E" },
                  { name: "Midnight Bistro", primary: "#6366F1", secondary: "#4338CA" },
                  { name: "Ruby Dine", primary: "#E11D48", secondary: "#9F1239" },
                  { name: "Gold Luxe", primary: "#EAB308", secondary: "#A16207" },
                ].map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(palette.primary);
                      setSecondaryColor(palette.secondary);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    />
                    {palette.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSaveColors}>
                Save Branding Colors
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Mobile Phone */}
        <div className={`lg:col-span-5 lg:sticky lg:top-24 ${mobileTab === "design" ? "hidden lg:block" : "block"}`}>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex justify-center">
            <PhonePreview
              restaurant={{
                ...restaurant,
                primary_color: primaryColor,
                secondary_color: secondaryColor,
              }}
              categories={categories}
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
