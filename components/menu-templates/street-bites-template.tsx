"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Flame, Sparkles, ChevronRight, Zap } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function StreetBitesTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#FFFDF9] text-zinc-950 min-h-full font-sans pb-16 selection:bg-orange-200">
      {/* Dynamic Header Banner */}
      {restaurant.cover_image_url ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-red-600">
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      )}

      {/* Header Profile */}
      <header className="relative max-w-xl mx-auto px-4 -mt-12 sm:-mt-14 text-center mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-100">
          {restaurant.logo_url ? (
            <div className="relative inline-block mx-auto -mt-14 mb-2">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-20 h-20 rounded-2xl mx-auto object-cover border-4 border-white shadow-xl ring-2 ring-orange-400"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl mx-auto -mt-12 bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center border-4 border-white shadow-lg text-white">
              <Flame className="w-8 h-8 fill-white" />
            </div>
          )}

          <h1 className="text-2xl font-black text-zinc-950 mt-1 tracking-tight">{restaurant.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-orange-800 bg-orange-100 px-3 py-0.5 rounded-full">
              <Zap className="w-3 h-3 text-orange-600 fill-orange-500" />
              {restaurant.restaurant_type || "Fast Bites & Street Food"}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● Fast Delivery & Dine-In
            </span>
          </div>

          {restaurant.description && (
            <p className="text-xs text-zinc-600 mt-2.5 max-w-md mx-auto leading-relaxed">
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Order on WhatsApp
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-300 hover:bg-orange-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Menu Categories */}
      <main className="max-w-xl mx-auto px-4 space-y-8">
        {categories.map((cat) => {
          if (!cat.is_visible || cat.items.length === 0) return null;

          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-orange-500/20">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-xs" />
                <h2 className="text-base font-black uppercase tracking-tight text-zinc-900">
                  {cat.name}
                </h2>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full ml-auto">
                  {cat.items.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {cat.items.map((item) => {
                  if (!item.is_visible) return null;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      className={`group bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex gap-3 relative ${
                        !item.is_available ? "opacity-60 bg-zinc-50" : ""
                      }`}
                    >
                      {/* Dish Thumbnail */}
                      {item.image_url ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {!item.is_available && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-[10px] font-black text-white uppercase tracking-wider bg-rose-600 px-1.5 py-0.5 rounded">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <FoodIndicator type={item.food_type} size="sm" />
                              <h3 className="text-sm font-black text-zinc-950 group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </h3>
                            </div>
                            <span className="text-base font-black text-orange-600 font-mono shrink-0">
                              {formatCurrency(item.price, restaurant.currency)}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
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
                          <span className="text-[11px] font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            View <ChevronRight className="w-3 h-3" />
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
