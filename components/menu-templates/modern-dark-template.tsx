"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges, EstablishmentDietaryBadge } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Sparkles, ChevronRight, Eye } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function ModernDarkTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-full font-sans pb-16 selection:bg-emerald-900 selection:text-emerald-100">
      {/* Dark Ambient Header with Glow Orb */}
      <header className="relative border-b border-zinc-800/80 px-4 pt-10 pb-8 text-center bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 overflow-hidden">
        {/* Pulsing Emerald Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full animate-pulse-glow" />

        {restaurant.logo_url && (
          <div className="relative inline-block mx-auto mb-3">
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-emerald-500/40 shadow-xl ring-4 ring-zinc-800/80 transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center text-white" />
          </div>
        )}

        <h1 className="text-2xl font-black tracking-tight text-white">{restaurant.name}</h1>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5">
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full uppercase">
            {restaurant.restaurant_type || "Modern Kitchen & Bar"}
          </span>
          <EstablishmentDietaryBadge dietaryType={restaurant.dietary_type} />
        </div>

        {restaurant.description && (
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-2.5 leading-relaxed">
            {restaurant.description}
          </p>
        )}

        {/* Contact Icons with hover glow */}
        <div className="flex items-center justify-center gap-3 mt-5">
          {restaurant.whatsapp && (
            <a
              href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-950/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          {restaurant.instagram && (
            <a
              href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-pink-400 hover:border-pink-500 hover:bg-pink-950/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </header>

      {/* Categories & Futuristic Dark Cards */}
      <main className="max-w-xl mx-auto px-4 py-8 space-y-9">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm bg-zinc-900/40 rounded-3xl border border-zinc-850 animate-fade-in-up">
            No items found matching your filters.
          </div>
        ) : (
          categories.map((category) => (
            <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-20">
              <div className="flex items-center justify-between pb-2.5 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                    {category.name}
                  </h2>
                </div>
                <span className="text-[11px] text-emerald-400/80 font-mono bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/60">
                  {category.items.length} dishes
                </span>
              </div>

              <div className="space-y-3.5">
                {category.items.map((item, itemIdx) => {
                  const isSoldOut = !item.is_available;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      style={{ animationDelay: `${itemIdx * 45}ms` }}
                      className={`group cursor-pointer glass-card-dark rounded-2xl p-4 border border-zinc-800/90 flex items-start justify-between gap-3.5 transition-all duration-300 animate-fade-in-up hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] ${
                        isSoldOut ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FoodIndicator type={item.food_type} size="sm" />
                          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors truncate">
                            {item.name}
                          </h3>
                        </div>

                        {item.description && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <DietaryBadges
                          isBestseller={item.is_bestseller}
                          isSpicy={item.is_spicy}
                          isVegan={item.is_vegan}
                          isJain={item.is_jain}
                        />

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {formatCurrency(item.price, restaurant.currency)}
                          </span>

                          {isSoldOut ? (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded-full">
                              SOLD OUT
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-emerald-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              View <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>

                      {item.image_url && (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800 relative">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                              isSoldOut ? "grayscale" : ""
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Eye className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer Address */}
      {restaurant.address && (
        <footer className="max-w-xl mx-auto px-4 mt-6 text-center text-xs text-zinc-500 border-t border-zinc-800/60 pt-6 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {restaurant.address}
            {restaurant.city ? `, ${restaurant.city}` : ""}
          </span>
        </footer>
      )}
    </div>
  );
}
