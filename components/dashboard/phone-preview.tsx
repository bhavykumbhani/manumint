"use client";

import React, { useState } from "react";
import { Category, MenuItem, Restaurant } from "@/types";
import { MENU_TEMPLATES } from "@/components/menu-templates";
import { Wifi, Battery, Signal, Search } from "lucide-react";
import { DishDetailModal } from "@/components/public-menu/dish-detail-modal";

interface PhonePreviewProps {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
}

export function PhonePreview({ restaurant, categories, items }: PhonePreviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "veg" | "non_veg" | "egg">("all");
  const [previewSelectedItem, setPreviewSelectedItem] = useState<MenuItem | null>(null);

  const TemplateComponent = MENU_TEMPLATES[restaurant.template_key] || MENU_TEMPLATES.cafe;

  // Filter items based on search and dietary filter
  const filteredCategories = categories
    .filter((cat) => cat.is_visible)
    .map((cat) => {
      const catItems = items
        .filter((item) => item.category_id === cat.id && item.is_visible)
        .filter((item) => {
          // Dietary Filter
          if (selectedFilter === "veg" && item.food_type !== "veg") return false;
          if (selectedFilter === "non_veg" && item.food_type !== "non_veg") return false;
          if (selectedFilter === "egg" && item.food_type !== "egg") return false;

          // Search Filter
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesName = item.name.toLowerCase().includes(q);
            const matchesDesc = item.description?.toLowerCase().includes(q);
            return matchesName || matchesDesc;
          }
          return true;
        });

      return {
        ...cat,
        items: catItems,
      };
    })
    .filter((cat) => cat.items.length > 0 || !searchQuery.trim());

  return (
    <div className="flex flex-col items-center">
      {/* Label / Device Info */}
      <div className="flex items-center justify-between w-full max-w-[340px] mb-2 px-1 text-xs text-zinc-400 font-medium">
        <span>Live Mobile Simulator</span>
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-time Preview
        </span>
      </div>

      {/* Simulated Phone Shell */}
      <div className="relative w-[340px] h-[670px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-zinc-800 ring-1 ring-zinc-700/50 flex flex-col overflow-hidden transition-all duration-300">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
        </div>

        {/* Screen Bezel / Container */}
        <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[38px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="h-9 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 z-20 shrink-0 bg-inherit">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick In-Phone Search Bar */}
          <div className="px-3 pt-1 pb-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0 bg-inherit z-10 flex flex-col gap-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-8 pr-3 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {(["all", "veg", "non_veg", "egg"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all duration-150 active:scale-90 ${
                    selectedFilter === filter
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {filter === "all" ? "All" : filter === "veg" ? "🌱 Veg" : filter === "non_veg" ? "🍗 Non-Veg" : "🥚 Egg"}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Template Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            <TemplateComponent
              restaurant={restaurant}
              categories={filteredCategories}
              searchQuery={searchQuery}
              selectedFilter={selectedFilter}
              isSimulatedPreview={true}
              onItemClick={(item) => setPreviewSelectedItem(item)}
            />
          </div>

          {/* Bottom Home Bar */}
          <div className="h-4 bg-inherit flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* Dish Detail Modal in Preview */}
      <DishDetailModal
        item={previewSelectedItem}
        restaurant={restaurant}
        onClose={() => setPreviewSelectedItem(null)}
      />
    </div>
  );
}
