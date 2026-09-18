"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges, EstablishmentDietaryBadge } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Sparkles, ChevronRight, Eye } from "lucide-react";

export function ElegantTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#121417] text-[#E8E6E3] min-h-full font-serif pb-16 selection:bg-amber-900 selection:text-amber-100">
      {/* Decorative Gold Header with warm candlelight glow */}
      <header className="relative px-6 pt-12 pb-10 text-center border-b border-[#2C2F36] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mx-auto mb-4" />
        
        {restaurant.logo_url && (
          <div className="relative inline-block mx-auto mb-3">
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border border-amber-500/50 p-1 shadow-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        <h1 className="text-3xl font-normal tracking-wider text-amber-100 uppercase font-serif">
          {restaurant.name}
        </h1>
        <p className="text-[10px] font-sans tracking-[0.3em] text-amber-400/90 uppercase mt-1">
          {restaurant.restaurant_type || "Fine Dining & Lounge"}
        </p>
        <div className="mt-2.5 flex justify-center">
          <EstablishmentDietaryBadge dietaryType={restaurant.dietary_type} />
        </div>

        {restaurant.description && (
          <p className="text-xs text-[#9E9B95] max-w-sm mx-auto mt-3 font-sans italic leading-relaxed">
            "{restaurant.description}"
          </p>
        )}

        <div className="flex items-center justify-center gap-5 mt-6 font-sans">
          {restaurant.whatsapp && (
            <a
              href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-300 hover:text-amber-200 transition-all uppercase tracking-widest flex items-center gap-1.5 py-1 px-3 rounded-full border border-amber-500/30 hover:bg-amber-500/10"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Concierge
            </a>
          )}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="text-xs text-amber-300 hover:text-amber-200 transition-all uppercase tracking-widest flex items-center gap-1.5 py-1 px-3 rounded-full border border-amber-500/30 hover:bg-amber-500/10"
            >
              <Phone className="w-3.5 h-3.5" />
              Reservations
            </a>
          )}
        </div>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mx-auto mt-6" />
      </header>

      {/* Menu Categories with Classical Elegance */}
      <main className="max-w-xl mx-auto px-5 py-9 space-y-10">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-[#7E7B75] text-sm font-sans animate-fade-in-up">
            No culinary offerings match your selection.
          </div>
        ) : (
          categories.map((category) => (
            <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-20">
              <div className="text-center mb-6">
                <h2 className="text-lg font-normal tracking-[0.2em] text-amber-200 uppercase">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-xs text-[#8E8B85] font-sans italic mt-1">
                    {category.description}
                  </p>
                )}
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mt-2.5" />
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIdx) => {
                  const isSoldOut = !item.is_available;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      style={{ animationDelay: `${itemIdx * 45}ms` }}
                      className={`group cursor-pointer p-3.5 rounded-2xl border border-transparent hover:border-[#2C2F36] hover:bg-[#181B20]/60 transition-all duration-300 animate-fade-in-up ${
                        isSoldOut ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <FoodIndicator type={item.food_type} size="sm" />
                          <h3 className="text-base font-medium text-[#F4F1EA] group-hover:text-amber-200 tracking-wide transition-colors">
                            {item.name}
                          </h3>
                        </div>

                        {/* Dot leader line */}
                        <div className="flex-1 border-b border-dotted border-[#3A3D45] mx-1 h-2" />

                        <span className="text-sm font-sans font-semibold text-amber-300 shrink-0">
                          {formatCurrency(item.price, restaurant.currency)}
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-start justify-between gap-3 font-sans">
                        <div className="flex-1">
                          {item.description && (
                            <p className="text-xs text-[#9E9B95] leading-relaxed line-clamp-2">
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

                        {isSoldOut ? (
                          <span className="text-[10px] uppercase tracking-wider text-rose-400 border border-rose-900/60 bg-rose-950/40 px-2 py-0.5 rounded">
                            Unavailable
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400/80 group-hover:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            Detail <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
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
        <footer className="max-w-xl mx-auto px-4 mt-8 text-center text-xs text-[#7E7B75] font-sans flex items-center justify-center gap-1.5 border-t border-[#2C2F36] pt-6">
          <MapPin className="w-3.5 h-3.5 text-amber-500/70" />
          <span>
            {restaurant.address}
            {restaurant.city ? `, ${restaurant.city}` : ""}
          </span>
        </footer>
      )}
    </div>
  );
}
