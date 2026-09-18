"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, Crown, Sparkles, ChevronRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function RoyalHeritageTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-[#21090E] text-[#FDF8F0] min-h-full font-serif pb-16 selection:bg-[#B45309]/30">
      {/* Royal Cover Banner */}
      {restaurant.cover_image_url ? (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#2D0F16]">
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#21090E] via-[#21090E]/60 to-transparent" />
        </div>
      ) : (
        <div className="h-24 bg-gradient-to-r from-[#3B0713] via-[#500724] to-[#3B0713] border-b border-[#D4AF37]/30" />
      )}

      {/* Royal Heritage Header Card */}
      <header className="relative max-w-xl mx-auto px-4 -mt-10 sm:-mt-12 text-center mb-8">
        <div className="bg-[#2D0F16] rounded-3xl p-6 shadow-2xl border border-[#D4AF37]/40 relative">
          {/* Ornamental Corner Filigree */}
          <div className="absolute top-2 left-2 text-[#D4AF37]/50 text-xs select-none">❖</div>
          <div className="absolute top-2 right-2 text-[#D4AF37]/50 text-xs select-none">❖</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37]/50 text-xs select-none">❖</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37]/50 text-xs select-none">❖</div>

          {restaurant.logo_url ? (
            <div className="relative inline-block mx-auto -mt-14 mb-2">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#2D0F16] shadow-2xl ring-2 ring-[#D4AF37]"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto -mt-12 bg-gradient-to-br from-[#D4AF37] to-[#B45309] flex items-center justify-center border-4 border-[#2D0F16] shadow-xl text-[#21090E]">
              <Crown className="w-8 h-8 fill-current" />
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest font-sans font-bold">
            <span>—</span>
            <Crown className="w-3.5 h-3.5" />
            <span>Royal Dining</span>
            <span>—</span>
          </div>

          <h1 className="text-3xl font-bold text-[#FDF8F0] mt-1 tracking-wide font-serif">
            {restaurant.name}
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap font-sans">
            <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-0.5 rounded-full border border-[#D4AF37]/30">
              {restaurant.restaurant_type || "Royal Indian Cuisine"}
            </span>
          </div>

          {restaurant.description && (
            <p className="text-xs text-[#E5D7C2] mt-3 max-w-md mx-auto leading-relaxed italic">
              &ldquo;{restaurant.description}&rdquo;
            </p>
          )}

          {/* Social / Contact Quick Action */}
          <div className="flex items-center justify-center gap-2.5 mt-5 font-sans">
            {restaurant.whatsapp && (
              <a
                href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#D4AF37] text-[#21090E] hover:bg-[#E5C158] transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Royal Concierge
              </a>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-[#FDF8F0] border border-[#D4AF37]/40 hover:bg-white/15 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Table Reservation
              </a>
            )}
            {restaurant.instagram && (
              <a
                href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#831843]/40 text-[#FDF8F0] border border-[#D4AF37]/30 hover:bg-[#831843]/60 transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Menu Sections */}
      <main className="max-w-xl mx-auto px-4 space-y-9">
        {categories.map((cat) => {
          if (!cat.is_visible || cat.items.length === 0) return null;

          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
              <div className="text-center pb-2 mb-4 border-b border-[#D4AF37]/30">
                <span className="text-[#D4AF37] text-sm block">❖ ❖ ❖</span>
                <h2 className="text-xl font-bold text-[#FDF8F0] tracking-wider uppercase font-serif mt-0.5">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-[11px] text-[#C5B39B] italic font-serif mt-0.5">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {cat.items.map((item) => {
                  if (!item.is_visible) return null;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      className={`group bg-[#2A0E15]/90 rounded-2xl p-4 border border-[#D4AF37]/25 hover:border-[#D4AF37] shadow-lg transition-all cursor-pointer flex gap-3.5 relative overflow-hidden ${
                        !item.is_available ? "opacity-50" : ""
                      }`}
                    >
                      {/* Left thumbnail */}
                      {item.image_url ? (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#1E080E] shrink-0 border border-[#D4AF37]/30">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      {/* Info & Price */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <FoodIndicator type={item.food_type} size="sm" />
                              <h3 className="text-base font-bold text-[#FDF8F0] group-hover:text-[#D4AF37] transition-colors font-serif">
                                {item.name}
                              </h3>
                            </div>
                            <span className="text-base font-bold text-[#D4AF37] font-mono shrink-0">
                              {formatCurrency(item.price, restaurant.currency)}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-[#D8C7B0] line-clamp-2 leading-relaxed font-sans font-normal">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5 font-sans">
                          <DietaryBadges
                            isBestseller={item.is_bestseller}
                            isSpicy={item.is_spicy}
                            isVegan={item.is_vegan}
                            isJain={item.is_jain}
                          />
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-0.5">
                            Royal Selection <ChevronRight className="w-3 h-3" />
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
