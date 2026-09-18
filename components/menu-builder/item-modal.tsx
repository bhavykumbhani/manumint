"use client";

import React, { useState, useEffect, useRef } from "react";
import { Category, FoodType, MenuItem } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FoodIndicator } from "@/components/ui/food-indicator";
import { useMenuStore } from "@/lib/store";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isJain, setIsJain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be under 5MB");
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      setError("Failed to process image file");
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

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
  }, [item, isOpen, initialCategoryId, categories, isPureVeg]);

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

        {/* Dish Photo (File Upload + URL Option) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Dish Photo (Optional)
          </label>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          {imageUrl ? (
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 shrink-0 border border-zinc-300 dark:border-zinc-600 relative">
                <img
                  src={imageUrl}
                  alt="Dish preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  Photo Selected
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Ready for menu display
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    Change Photo
                  </button>
                  <span className="text-zinc-300 dark:text-zinc-600">•</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-dashed border-emerald-500/70 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100/50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {isUploadingImage ? "Processing..." : "Upload from Device / Camera"}
              </button>
              <span className="text-[11px] text-zinc-400">or paste URL:</span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}
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
