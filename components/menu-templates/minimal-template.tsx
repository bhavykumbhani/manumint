"use client";

import React from "react";
import { TemplateProps } from "./types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Phone, MapPin, MessageCircle, ChevronRight, Eye } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function MinimalTemplate({
  restaurant,
  categories,
  onItemClick,
}: TemplateProps) {
  return (
    <div className="bg-white text-zinc-900 min-h-full font-sans pb-16 selection:bg-zinc-200">
      {/* Top Header */}
      <header className="border-b border-zinc-100 px-5 pt-10 pb-7 text-center">
        {restaurant.logo_url && (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="w-18 h-18 rounded-full mx-auto mb-3 object-cover border border-zinc-200 shadow-sm transition-transform duration-300 hover:scale-105"
          />
        )}
        <h1 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">{restaurant.name}</h1>
        <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-1">
          {restaurant.restaurant_type || "Contemporary Dining"}
        </p>

        {restaurant.description && (
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
            {restaurant.description}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-4 text-zinc-400">
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`} className="p-2 rounded-xl hover:text-zinc-800 hover:bg-zinc-100 transition-colors">
              <Phone className="w-4 h-4" />
            </a>
          )}
          {restaurant.whatsapp && (
            <a
              href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {restaurant.instagram && (
            <a
              href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl hover:text-pink-600 hover:bg-pink-50 transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </header>

      {/* Menu Categories */}
      <main className="max-w-xl mx-auto px-4 py-8 space-y-9">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm animate-fade-in-up">
            No items found matching your filter.
          </div>
        ) : (
          categories.map((category) => (
            <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-20">
              <div className="border-b-2 border-zinc-950 pb-2 mb-4 flex items-baseline justify-between">
                <h2 className="text-xs font-black tracking-widest text-zinc-950 uppercase">
                  {category.name}
                </h2>
                <span className="text-[11px] font-mono text-zinc-400">[{category.items.length}]</span>
              </div>

              <div className="divide-y divide-zinc-100">
                {category.items.map((item, itemIdx) => {
                  const isSoldOut = !item.is_available;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      style={{ animationDelay: `${itemIdx * 45}ms` }}
                      className={`group cursor-pointer py-4 flex items-start justify-between gap-4 transition-all duration-200 animate-fade-in-up hover:bg-zinc-50/80 px-2 rounded-xl ${
                        isSoldOut ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FoodIndicator type={item.food_type} size="sm" />
                          <h3 className="text-sm font-bold text-zinc-950 group-hover:text-emerald-700 transition-colors truncate">
                            {item.name}
                          </h3>
                          {isSoldOut && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-500 border border-zinc-200 uppercase tracking-wider">
                              Sold Out
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
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

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold font-mono text-zinc-950">
                          {formatCurrency(item.price, restaurant.currency)}
                        </span>
                        {item.image_url && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-100 shadow-2xs">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
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
        <footer className="text-center text-xs text-zinc-400 px-4 pt-8 pb-4 border-t border-zinc-100 flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {restaurant.address}
            {restaurant.city ? `, ${restaurant.city}` : ""}
          </span>
        </footer>
      )}
    </div>
  );
}
