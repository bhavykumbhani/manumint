import React from "react";
import { FoodType } from "@/types";
import { Flame, Sparkles, Leaf } from "lucide-react";

interface FoodIndicatorProps {
  type: FoodType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FoodIndicator({ type, size = "md", className = "" }: FoodIndicatorProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5 p-0.5",
    md: "w-4.5 h-4.5 p-0.5",
    lg: "w-5.5 h-5.5 p-0.5",
  };

  const innerDotClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  if (type === "veg") {
    return (
      <span
        title="Vegetarian"
        className={`inline-flex items-center justify-center border-2 border-emerald-600 rounded-[3px] bg-white ${sizeClasses[size]} ${className}`}
      >
        <span className={`rounded-full bg-emerald-600 ${innerDotClasses[size]}`} />
      </span>
    );
  }

  if (type === "non_veg") {
    return (
      <span
        title="Non-Vegetarian"
        className={`inline-flex items-center justify-center border-2 border-rose-700 rounded-[3px] bg-white ${sizeClasses[size]} ${className}`}
      >
        <span className={`w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-700`} />
      </span>
    );
  }

  // Egg
  return (
    <span
      title="Contains Egg"
      className={`inline-flex items-center justify-center border-2 border-amber-600 rounded-[3px] bg-white ${sizeClasses[size]} ${className}`}
    >
      <span className={`rounded-full bg-amber-600 ${innerDotClasses[size]}`} />
    </span>
  );
}

export function DietaryBadges({
  isBestseller,
  isSpicy,
  isVegan,
  isJain,
}: {
  isBestseller?: boolean;
  isSpicy?: boolean;
  isVegan?: boolean;
  isJain?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1">
      {isBestseller && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
          Bestseller
        </span>
      )}
      {isSpicy && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
          <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
          Spicy
        </span>
      )}
      {isVegan && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30">
          <Leaf className="w-3 h-3 text-teal-500" />
          Vegan
        </span>
      )}
      {isJain && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
          Jain
        </span>
      )}
    </div>
  );
}
