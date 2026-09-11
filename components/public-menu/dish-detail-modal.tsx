"use client";

import React from "react";
import { MenuItem, Restaurant } from "@/types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { X, MessageCircle, Sparkles, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DishDetailModalProps {
  item: MenuItem | null;
  restaurant: Restaurant;
  onClose: () => void;
}

export function DishDetailModal({ item, restaurant, onClose }: DishDetailModalProps) {
  const [liked, setLiked] = React.useState(false);

  if (!item) return null;

  const isSoldOut = !item.is_available;
  const whatsappNumber = restaurant.whatsapp ? restaurant.whatsapp.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi ${restaurant.name}, I'm interested in ordering *${item.name}* (${formatCurrency(
          item.price,
          restaurant.currency
        )}) from your digital menu!`
      )}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[88vh] animate-scale-up">
        {/* Close & Favorite Floating Buttons */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-all ${
              liked
                ? "bg-rose-500 text-white"
                : "bg-white/80 dark:bg-black/60 text-zinc-700 dark:text-zinc-200 hover:scale-105"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-zinc-700 dark:text-zinc-200 flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image */}
        {item.image_url ? (
          <div className="relative h-60 sm:h-72 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
                isSoldOut ? "grayscale" : ""
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges on image */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <FoodIndicator type={item.food_type} size="md" />
              {isSoldOut ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                  Currently Sold Out
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3" /> Freshly Available
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-6 px-6">
            <div className="flex items-center gap-2">
              <FoodIndicator type={item.food_type} size="md" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {item.food_type === "veg" ? "Pure Vegetarian" : item.food_type === "non_veg" ? "Non-Vegetarian" : "Contains Egg"}
              </span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
                {item.name}
              </h3>
              <DietaryBadges
                isBestseller={item.is_bestseller}
                isSpicy={item.is_spicy}
                isVegan={item.is_vegan}
                isJain={item.is_jain}
              />
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
              {formatCurrency(item.price, restaurant.currency)}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1 border-t border-zinc-100 dark:border-zinc-800">
              {item.description}
            </p>
          )}

          {/* Quick Info Badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] font-semibold uppercase">Category</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Signature Dish</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] font-semibold uppercase">Dining Venue</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                {restaurant.name}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-850/80 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="primary"
                size="md"
                disabled={isSoldOut}
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Inquire on WhatsApp
              </Button>
            </a>
          )}
          <Button variant="outline" size="md" onClick={onClose} className="shrink-0">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
