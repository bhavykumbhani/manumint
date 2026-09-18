"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Leaf, Sparkles, ChevronRight, Sprout } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function BotanicalGardenTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#F6F8F5] text-emerald-950 min-h-full font-sans pb-16 selection:bg-emerald-200">
      {/* Cover / Botanical Greenery Header */}
      {restaurant.cover_image_url ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-emerald-900">
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F6F8F5] via-emerald-950/40 to-transparent" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 flex items-center justify-center text-emerald-100">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>Farm to Table • Fresh & Wholesome</span>
          </div>
        </div>
      )}

      {/* Header Profile */}
      <header className="relative max-w-xl mx-auto px-4 -mt-12 sm:-mt-14 text-center mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-emerald-200/80">
          {restaurant.logo_url ? (
            <div className="relative inline-block mx-auto -mt-14 mb-2">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-2 ring-emerald-500/40"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Leaf className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto -mt-12 bg-emerald-100 flex items-center justify-center border-4 border-white shadow-md text-emerald-700">
              <Leaf className="w-8 h-8 fill-emerald-600" />
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Organic & Conscious Dining</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1 tracking-tight">
            {restaurant.name}
          </h1>

          <p className="text-xs text-emerald-800/80 mt-1 font-semibold">
            {restaurant.restaurant_type || "Botanical Kitchen & Salad Bar"}
          </p>

          {restaurant.description && (
            <p className="text-xs text-emerald-900/70 mt-2.5 max-w-md mx-auto leading-relaxed">
              {restaurant.description}
            </p>
          )}

          {/* Social Quick Actions */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {restaurant.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 transition-all active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Order
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Cafe
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
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
              <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-emerald-500/20">
                <Leaf className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                <h2 className="text-base font-black uppercase tracking-wide text-emerald-950">
                  {cat.name}
                </h2>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full ml-auto">
                  {cat.items.length} dishes
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {cat.items.map((item) => {
                  if (!item.is_visible) return null;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      className={`group bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex gap-3 relative ${
                        !item.is_available ? "opacity-60" : ""
                      }`}
                    >
                      {/* Photo */}
                      {item.image_url ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-emerald-50 shrink-0 border border-emerald-100">
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
                              <h3 className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">
                                {item.name}
                              </h3>
                            </div>
                            <span className="text-base font-black text-emerald-700 font-mono shrink-0">
                              {formatCurrency(item.price, restaurant.currency)}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-emerald-900/70 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-emerald-50">
                          <DietaryBadges
                            isBestseller={item.is_bestseller}
                            isSpicy={item.is_spicy}
                            isVegan={item.is_vegan}
                            isJain={item.is_jain}
                          />
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            Details <ChevronRight className="w-3.5 h-3.5" />
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
