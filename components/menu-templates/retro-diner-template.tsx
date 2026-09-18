"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges, EstablishmentDietaryBadge } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Utensils, Sparkles, ChevronRight, Star } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function RetroDinerTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#FFFDF5] text-zinc-950 min-h-full font-sans pb-16 selection:bg-red-200">
      {/* Retro Checkered Border Header Top Strip */}
      <div
        className="h-3 w-full bg-[linear-gradient(45deg,#DC2626_25%,transparent_25%),linear-gradient(-45deg,#DC2626_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#DC2626_75%),linear-gradient(-45deg,transparent_75%,#DC2626_75%)] bg-[size:16px_16px] bg-[#FEF2F2]"
      />

      {/* Hero Banner */}
      {restaurant.cover_image_url ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-red-800">
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full border border-white/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Classic Diner & Handcrafted Treats</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}

      {/* Profile Card */}
      <header className="relative max-w-xl mx-auto px-4 -mt-12 text-center mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-500/30">
          {restaurant.logo_url ? (
            <div className="relative inline-block mx-auto -mt-14 mb-2">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-2 ring-red-500"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto -mt-12 bg-red-600 flex items-center justify-center border-4 border-white shadow-lg text-white">
              <Utensils className="w-8 h-8" />
            </div>
          )}

          <div className="inline-block px-3 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">
            ★ SINCE 2024 ★
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1 tracking-tight">
            {restaurant.name}
          </h1>

          <p className="text-xs text-zinc-500 font-semibold mt-1">
            {restaurant.restaurant_type || "Classic Diner & Pizzeria"}
          </p>

          <div className="flex justify-center mt-2">
            <EstablishmentDietaryBadge dietaryType={restaurant.dietary_type} />
          </div>

          {restaurant.description && (
            <p className="text-xs text-zinc-600 mt-2 max-w-md mx-auto leading-relaxed font-medium">
              {restaurant.description}
            </p>
          )}

          {/* Action Pills */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {restaurant.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-md hover:bg-red-700 transition-all active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Order
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Diner
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Menu Categories */}
      <main className="max-w-xl mx-auto px-4 space-y-7">
        {categories.map((cat) => {
          if (!cat.is_visible || cat.items.length === 0) return null;

          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-dashed border-red-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-sm rotate-45 inline-block" />
                  <h2 className="text-base font-black uppercase tracking-wider text-red-950">
                    {cat.name}
                  </h2>
                </div>
                <span className="text-[10px] font-black text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-full">
                  Freshly Prepped
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {cat.items.map((item) => {
                  if (!item.is_visible) return null;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      className={`group bg-white rounded-2xl p-3.5 border-2 border-zinc-200/80 hover:border-red-500 shadow-sm transition-all cursor-pointer flex gap-3 relative ${
                        !item.is_available ? "opacity-60" : ""
                      }`}
                    >
                      {/* Photo */}
                      {item.image_url ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5">
                              <FoodIndicator type={item.food_type} size="sm" />
                              <h3 className="text-sm font-black text-zinc-950 group-hover:text-red-600 transition-colors">
                                {item.name}
                              </h3>
                            </div>
                            <span className="text-base font-black text-red-600 font-mono shrink-0">
                              {formatCurrency(item.price, restaurant.currency)}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-1">
                          <DietaryBadges
                            isBestseller={item.is_bestseller}
                            isSpicy={item.is_spicy}
                            isVegan={item.is_vegan}
                            isJain={item.is_jain}
                          />
                          <span className="text-[11px] font-bold text-red-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            Tap to View <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
