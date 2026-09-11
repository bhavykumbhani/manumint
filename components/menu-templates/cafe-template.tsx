"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Coffee, Sparkles, ChevronRight, Eye } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function CafeTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#FAF7F2] text-amber-950 min-h-full font-sans pb-16 selection:bg-amber-200">
      {/* Cover Image / Banner with subtle gradient pulse */}
      {restaurant.cover_image_url ? (
        <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-amber-200">
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-6 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 animate-shimmer" />
      )}

      {/* Header Profile Card with Glassmorphism & Float */}
      <header className="relative max-w-xl mx-auto px-4 -mt-12 sm:-mt-14 text-center mb-6">
        <div className="glass-card rounded-3xl p-5 shadow-lg border border-amber-200/80 transition-all duration-300 hover:shadow-xl">
          {restaurant.logo_url ? (
            <div className="relative inline-block mx-auto -mt-14 mb-1">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-2 ring-amber-300/40 transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm" title="Open & Serving">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto -mt-12 bg-amber-100 flex items-center justify-center border-4 border-white shadow-md text-amber-800 animate-float">
              <Coffee className="w-7 h-7" />
            </div>
          )}

          <h1 className="text-2xl font-black text-amber-950 mt-1 tracking-tight">{restaurant.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 px-3 py-0.5 rounded-full shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {restaurant.restaurant_type || "Artisanal Café"}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Fresh Menu
            </span>
          </div>

          {restaurant.description && (
            <p className="text-xs text-amber-900/80 mt-2.5 max-w-md mx-auto leading-relaxed font-medium">
              {restaurant.description}
            </p>
          )}

          {/* Social / Contact Quick Action Pills with micro-press scale */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {restaurant.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-800 hover:text-white transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Menu Categories & Dishes */}
      <main className="max-w-xl mx-auto px-4 space-y-7">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-amber-800/60 text-sm bg-white rounded-3xl border border-amber-100 shadow-sm animate-fade-in-up">
            No dishes found matching your selection.
          </div>
        ) : (
          categories.map((category, catIdx) => (
            <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-20">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 shadow-xs" />
                  <h2 className="text-base font-black text-amber-950 tracking-tight">
                    {category.name}
                  </h2>
                </div>
                <span className="text-xs font-bold text-amber-700/60 font-mono bg-amber-100/60 px-2 py-0.5 rounded-full">
                  {category.items.length} dishes
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {category.items.map((item, itemIdx) => {
                  const isSoldOut = !item.is_available;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      style={{ animationDelay: `${itemIdx * 45}ms` }}
                      className={`group cursor-pointer bg-white rounded-2xl p-4 shadow-xs border border-amber-100/80 flex gap-3.5 transition-all duration-300 animate-fade-in-up hover:-translate-y-1 hover:shadow-md hover:border-amber-300 relative overflow-hidden ${
                        isSoldOut ? "opacity-60 bg-stone-50" : ""
                      }`}
                    >
                      {/* Left: Dish Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <FoodIndicator type={item.food_type} size="sm" />
                            <h3 className="text-sm font-black text-amber-950 group-hover:text-amber-700 transition-colors truncate">
                              {item.name}
                            </h3>
                          </div>

                          {item.description && (
                            <p className="text-xs text-amber-900/70 line-clamp-2 leading-relaxed mb-2 font-medium">
                              {item.description}
                            </p>
                          )}

                          <DietaryBadges
                            isBestseller={item.is_bestseller}
                            isSpicy={item.is_spicy}
                            isVegan={item.is_vegan}
                            isJain={item.is_jain}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-amber-950 font-mono">
                              {formatCurrency(item.price, restaurant.currency)}
                            </span>
                            {item.is_bestseller && (
                              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                ★ Top Pick
                              </span>
                            )}
                          </div>

                          {isSoldOut ? (
                            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                              Sold Out
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-700 group-hover:text-emerald-700 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              View details <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Dish Photo with Hover Zoom & Shimmer */}
                      {item.image_url && (
                        <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shrink-0 bg-amber-100 shadow-2xs border border-amber-200/50">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                              isSoldOut ? "grayscale" : ""
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm text-amber-900 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 flex items-center justify-center shadow-md">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
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

      {/* Footer Address & Location */}
      {restaurant.address && (
        <footer className="max-w-xl mx-auto px-4 mt-10 text-center text-xs text-amber-800/80 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            {restaurant.address}
            {restaurant.city ? `, ${restaurant.city}` : ""}
          </span>
        </footer>
      )}
    </div>
  );
}
