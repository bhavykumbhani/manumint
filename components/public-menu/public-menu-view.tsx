"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { FullRestaurantData, MenuItem } from "@/types";
import { MENU_TEMPLATES } from "@/components/menu-templates";
import { Search, Sparkles } from "lucide-react";
import { DishDetailModal } from "./dish-detail-modal";
import { CartTray, CartItem } from "./cart-tray";
import { trackEvent } from "@/lib/meta-pixel";
import { recordMenuView } from "@/lib/supabase/queries";

interface PublicMenuViewProps {
  data: FullRestaurantData;
}

export function PublicMenuView({ data }: PublicMenuViewProps) {
  const { restaurant, categories } = data;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "veg" | "non_veg" | "egg" | "jain" | "vegan">("all");
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: restaurant.name,
      content_category: "Restaurant Menu",
      content_ids: [restaurant.id],
    });
    if (typeof window !== "undefined" && restaurant.id) {
      recordMenuView(restaurant.id, document.referrer, navigator.userAgent);
    }
  }, [restaurant.id, restaurant.name]);

  const TemplateComponent = MENU_TEMPLATES[restaurant.template_key] || MENU_TEMPLATES.cafe;

  const isPureVeg = restaurant.dietary_type === "pure_veg";
  const isNonVegSpecialty = restaurant.dietary_type === "non_veg";

  // Filter items based on client-side search & dietary pills
  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const catItems = cat.items.filter((item) => {
          // Strictly protect Pure Veg integrity
          if (isPureVeg && item.food_type === "non_veg") return false;

          // Dietary Filter
          if (selectedFilter === "veg" && item.food_type !== "veg") return false;
          if (selectedFilter === "non_veg" && item.food_type !== "non_veg") return false;
          if (selectedFilter === "egg" && item.food_type !== "egg") return false;
          if (selectedFilter === "jain" && !item.is_jain) return false;
          if (selectedFilter === "vegan" && !item.is_vegan) return false;

          // Search Filter
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
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
  }, [categories, searchQuery, selectedFilter, isPureVeg]);

  const filterOptions = useMemo(() => {
    if (isPureVeg) {
      return [
        { key: "all" as const, label: "All Items" },
        { key: "veg" as const, label: "🌱 100% Veg" },
        { key: "jain" as const, label: "Jain Friendly" },
        { key: "vegan" as const, label: "Vegan" },
      ];
    }
    if (isNonVegSpecialty) {
      return [
        { key: "all" as const, label: "All Items" },
        { key: "non_veg" as const, label: "🍗 Non-Veg" },
        { key: "egg" as const, label: "🥚 Egg" },
        { key: "veg" as const, label: "🌱 Veg" },
      ];
    }
    return [
      { key: "all" as const, label: "All Items" },
      { key: "veg" as const, label: "🌱 Veg" },
      { key: "non_veg" as const, label: "🍗 Non-Veg" },
      { key: "egg" as const, label: "🥚 Egg" },
      { key: "jain" as const, label: "Jain Friendly" },
      { key: "vegan" as const, label: "Vegan" },
    ];
  }, [isPureVeg, isNonVegSpecialty]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const element = document.getElementById(`cat-${catId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between selection:bg-emerald-100">
      <div>
        {/* Sticky Customer Search & Filter Bar */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 shadow-xs transition-all">
          <div className="max-w-xl mx-auto px-4 py-2.5 space-y-2">
            {/* Pure Veg Assurance Banner for complete customer trust */}
            {isPureVeg && (
              <div className="flex items-center justify-between px-1 text-[11px]">
                <span className="inline-flex items-center gap-1.5 font-black text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  🌱 100% Pure Vegetarian Kitchen
                </span>
                <span className="text-zinc-400 text-[10px] font-medium">Pure Veg Assurance</span>
              </div>
            )}

            {/* Search Input with Clear Button */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search dishes in ${restaurant.name}...`}
                className="w-full pl-10 pr-12 py-2 text-xs font-medium bg-zinc-100 dark:bg-zinc-800/80 border-none rounded-full text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-200/60 dark:bg-zinc-700 px-1.5 py-0.5 rounded-full"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Filter Pills with smooth selection bounce */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {filterOptions.map((f) => {
                const isActive = selectedFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setSelectedFilter(f.key)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm scale-[1.02]"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Category Quick Jump Bar */}
            {categories.length > 1 && !searchQuery && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar border-t border-zinc-100 dark:border-zinc-800/80 pt-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className={`text-xs pb-1 whitespace-nowrap border-b-2 transition-all duration-200 ${
                      activeCategory === cat.id
                        ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-black scale-[1.03]"
                        : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Menu Template Container */}
        <div className="w-full">
          <TemplateComponent
            restaurant={restaurant}
            categories={filteredCategories}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            activeCategory={activeCategory}
            onSelectCategory={scrollToCategory}
            onItemClick={(item) => setSelectedItem(item)}
          />
        </div>
      </div>

      {/* Dish Detail Interactive Modal */}
      <DishDetailModal
        item={selectedItem}
        restaurant={restaurant}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Floating Cart Tray & Call Waiter Controls */}
      <CartTray
        restaurant={restaurant}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Powered by ManuMaker Badge */}
      <footer className="py-6 pb-20 text-center text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-200/60 dark:border-zinc-800">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 font-medium hover:text-emerald-600 transition-colors"
        >
          <span>Crafted with</span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">ManuMaker</span>
          <span>• Beautiful digital menus</span>
        </Link>
      </footer>
    </div>
  );
}
