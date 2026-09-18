"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, GlassWater, Sparkles, ChevronRight, Moon } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function NeonLoungeTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#0A0B0E] text-zinc-100 min-h-full font-sans pb-16 selection:bg-cyan-500/30">
      {/* Cover / Glow Banner */}
      {restaurant.cover_image_url ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black">
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/70 to-transparent" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-cyan-950 via-purple-950 to-pink-950 border-b border-cyan-500/20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
        </div>
      )}

      {/* Header Profile */}
      <header className="relative max-w-xl mx-auto px-4 -mt-12 text-center mb-7">
        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-cyan-500/30 ring-1 ring-cyan-500/10">
          {restaurant.logo_url ? (
            <div className="relative inline-block mx-auto -mt-14 mb-2">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-20 h-20 rounded-2xl mx-auto object-cover border-4 border-zinc-900 shadow-2xl ring-2 ring-cyan-400"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl mx-auto -mt-12 bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center border-4 border-zinc-900 shadow-xl text-black">
              <Moon className="w-8 h-8 fill-black" />
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Rooftop & Lounge Experience</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {restaurant.name}
          </h1>

          <p className="text-xs text-zinc-400 mt-1 font-semibold">
            {restaurant.restaurant_type || "Bar, Kitchen & Lounge"}
          </p>

          {restaurant.description && (
            <p className="text-xs text-zinc-400 mt-2.5 max-w-md mx-auto leading-relaxed">
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Table VIP Order
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Bar
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-950/60 text-pink-400 border border-pink-500/30 hover:bg-pink-900/60 transition-colors"
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
              <div className="flex items-center justify-between pb-2 mb-3.5 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] inline-block" />
                  <h2 className="text-base font-black uppercase tracking-wider text-white">
                    {cat.name}
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
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
                      className={`group bg-zinc-900/70 backdrop-blur-md rounded-2xl p-3.5 border border-zinc-800 hover:border-cyan-500/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer flex gap-3 relative ${
                        !item.is_available ? "opacity-50" : ""
                      }`}
                    >
                      {/* Photo */}
                      {item.image_url ? (
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-800">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5">
                              <FoodIndicator type={item.food_type} size="sm" />
                              <h3 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                                {item.name}
                              </h3>
                            </div>
                            <span className="text-base font-black text-cyan-400 font-mono shrink-0">
                              {formatCurrency(item.price, restaurant.currency)}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-zinc-800/80">
                          <DietaryBadges
                            isBestseller={item.is_bestseller}
                            isSpicy={item.is_spicy}
                            isVegan={item.is_vegan}
                            isJain={item.is_jain}
                          />
                          <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
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
