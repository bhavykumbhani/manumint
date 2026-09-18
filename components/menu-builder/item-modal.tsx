"use client";

import React, { useState, useEffect } from "react";
import { Category, FoodType, MenuItem } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FoodIndicator } from "@/components/ui/food-indicator";
import { useMenuStore } from "@/lib/store";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<MenuItem, "id" | "restaurant_id" | "position" | "created_at" | "updated_at">) => Promise<void>;
  item?: MenuItem | null;
  categories: Category[];
  initialCategoryId?: string;
}

export function ItemModal({
  isOpen,
  onClose,
  onSave,
  item,
  categories,
  initialCategoryId,
}: ItemModalProps) {
  const { restaurant } = useMenuStore();
  const isPureVeg = restaurant?.dietary_type === "pure_veg";

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isJain, setIsJain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price.toString());
      setCategoryId(item.category_id);
      setDescription(item.description || "");
      setImageUrl(item.image_url || "");
      setFoodType(isPureVeg ? "veg" : item.food_type);
      setIsAvailable(item.is_available);
      setIsVisible(item.is_visible);
      setIsBestseller(item.is_bestseller);
      setIsSpicy(item.is_spicy);
      setIsVegan(item.is_vegan);
      setIsJain(item.is_jain);
    } else {
      setName("");
      setPrice("");
      setCategoryId(initialCategoryId || (categories[0]?.id || ""));
      setDescription("");
      setImageUrl("");
      setFoodType("veg");
      setIsAvailable(true);
      setIsVisible(true);
      setIsBestseller(false);
      setIsSpicy(false);
      setIsVegan(false);
      setIsJain(false);
    }
    setError(null);
  }, [item, isOpen, initialCategoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Item name is required");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please enter a valid price (₹0 or more)");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    if (isPureVeg && foodType !== "veg") {
      setError("Cannot add non-vegetarian or egg dishes to a 100% Pure Veg restaurant.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        name: name.trim(),
        price: parsedPrice,
        category_id: categoryId,
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        food_type: isPureVeg ? "veg" : foodType,
        is_available: isAvailable,
        is_visible: isVisible,
        is_bestseller: isBestseller,
        is_spicy: isSpicy,
        is_vegan: isVegan,
        is_jain: isJain,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? "Edit Dish" : "Add New Dish"}
      description="Configure dish name, price in INR (₹), food type, and dietary tags."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Primary Row: Name & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Dish / Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Masala Chai, Paneer Tikka..."
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Price (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-semibold">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="30"
                className="w-full pl-8 pr-3 py-2.5 text-sm font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Category *
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Food Type Selector (FSSAI) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Food Type (FSSAI Classification)
          </label>
          {isPureVeg ? (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FoodIndicator type="veg" size="md" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    100% Pure Vegetarian Dish
                  </p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                    Registered as Pure Veg. Non-veg and egg dishes are strictly restricted.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shrink-0">
                Pure Veg
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { type: "veg", label: "Vegetarian" },
                  { type: "non_veg", label: "Non-Veg" },
                  { type: "egg", label: "Contains Egg" },
                ] as const
              ).map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setFoodType(opt.type)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    foodType === opt.type
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 ring-1 ring-emerald-500"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <FoodIndicator type={opt.type} size="sm" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingredients, preparation style, notes..."
            className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
          />
        </div>

        {/* Image URL / Photo */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Photo URL (Optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Dietary & Status Toggles */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Status & Dietary Badges
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Switch
              checked={isAvailable}
              onChange={setIsAvailable}
              label="Available"
              description="Toggle Sold Out"
            />
            <Switch
              checked={isVisible}
              onChange={setIsVisible}
              label="Visible"
              description="Show on menu"
            />
            <Switch
              checked={isBestseller}
              onChange={setIsBestseller}
              label="Bestseller"
              description="Special badge"
            />
            <Switch
              checked={isSpicy}
              onChange={setIsSpicy}
              label="Spicy"
              description="Chili icon"
            />
            <Switch
              checked={isVegan}
              onChange={setIsVegan}
              label="Vegan"
              description="100% plant-based"
            />
            <Switch
              checked={isJain}
              onChange={setIsJain}
              label="Jain Friendly"
              description="No root vegetables"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {item ? "Save Changes" : "Add to Menu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
