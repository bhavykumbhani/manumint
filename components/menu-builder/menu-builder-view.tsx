"use client";

import React, { useState } from "react";
import { useMenuStore } from "@/lib/store";
import { Category, MenuItem } from "@/types";
import { FoodIndicator, DietaryBadges } from "@/components/ui/food-indicator";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { PhonePreview } from "@/components/dashboard/phone-preview";
import { ItemModal } from "./item-modal";
import { CategoryModal } from "./category-modal";
import { ConfirmDeleteModal } from "./confirm-delete-modal";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";

export function MenuBuilderView() {
  const {
    restaurant,
    categories,
    items,
    addCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    moveItem,
    toggleItemAvailability,
    toggleItemVisibility,
  } = useMenuStore();
  const { toast } = useToast();

  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeCategoryIdForItem, setActiveCategoryIdForItem] = useState<string>("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "category" | "item";
    id: string;
    title: string;
    name: string;
  } | null>(null);

  if (!restaurant) return null;

  const toggleCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleOpenAddItem = (catId: string) => {
    setEditingItem(null);
    setActiveCategoryIdForItem(catId);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setActiveCategoryIdForItem(item.category_id);
    setIsItemModalOpen(true);
  };

  const handleDuplicateItem = async (itemId: string) => {
    try {
      await duplicateItem(itemId);
      toast("Dish duplicated successfully", "success");
    } catch {
      toast("Failed to duplicate dish", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "category") {
        await deleteCategory(deleteTarget.id);
        toast(`Category "${deleteTarget.name}" deleted`, "info");
      } else {
        await deleteItem(deleteTarget.id);
        toast(`Item "${deleteTarget.name}" removed`, "info");
      }
    } catch {
      toast("Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Tab Toggle */}
      <div className="lg:hidden flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "editor"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Menu Editor
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === "preview"
              ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Live Phone Preview
        </button>
      </div>

      {/* Main Grid: Left Editor, Right Live Phone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Menu Editor */}
        <div className={`lg:col-span-7 xl:col-span-7 space-y-6 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
          {/* Action Header */}
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Categories & Dishes</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {categories.length} {categories.length === 1 ? "category" : "categories"} • {items.length} dishes
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Category
            </Button>
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Your menu is empty</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-5">
                Start by creating your first category such as "Hot Beverages", "Breakfast", or "Starters".
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, catIndex) => {
                const categoryItems = items
                  .filter((i) => i.category_id === category.id)
                  .sort((a, b) => a.position - b.position);
                const isCollapsed = collapsedCategories[category.id];

                return (
                  <div
                    key={category.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Category Header Bar */}
                    <div className="p-4 bg-zinc-50/70 dark:bg-zinc-850/60 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => toggleCollapse(category.id)}
                          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500"
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                              {category.name}
                            </h3>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                              {categoryItems.length}
                            </span>
                          </div>
                          {category.description && (
                            <p className="text-xs text-zinc-500 truncate max-w-sm">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Category Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          title="Move Category Up"
                          disabled={catIndex === 0}
                          onClick={() => moveCategory(category.id, "up")}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          title="Move Category Down"
                          disabled={catIndex === categories.length - 1}
                          onClick={() => moveCategory(category.id, "down")}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          title="Rename Category"
                          onClick={() => {
                            setEditingCategory(category);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete Category"
                          onClick={() => {
                            setDeleteTarget({
                              type: "category",
                              id: category.id,
                              title: "Delete Category?",
                              name: category.name,
                            });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Category Items List (Collapsible) */}
                    {!isCollapsed && (
                      <div className="p-4 space-y-3">
                        {categoryItems.length === 0 ? (
                          <div className="py-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                            No dishes in this category yet.
                          </div>
                        ) : (
                          categoryItems.map((item, itemIdx) => {
                            return (
                              <div
                                key={item.id}
                                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                                  !item.is_available
                                    ? "bg-zinc-50/60 dark:bg-zinc-850/40 border-zinc-200/60 dark:border-zinc-800 text-zinc-400"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                }`}
                              >
                                {/* Left Item Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FoodIndicator type={item.food_type} size="sm" />
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                      {item.name}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                      {formatCurrency(item.price, restaurant.currency)}
                                    </span>
                                    {!item.is_available && (
                                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                                        Sold Out
                                      </span>
                                    )}
                                    {!item.is_visible && (
                                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                                        Hidden
                                      </span>
                                    )}
                                  </div>

                                  {item.description && (
                                    <p className="text-xs text-zinc-500 line-clamp-1 mb-1.5">
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

                                {/* Item Image Thumbnail */}
                                {item.image_url && (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                                  />
                                )}

                                {/* Action Controls */}
                                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                                  {/* Availability Switch */}
                                  <div className="flex items-center" title="Toggle Sold Out Status">
                                    <Switch
                                      checked={item.is_available}
                                      onChange={() => toggleItemAvailability(item.id)}
                                    />
                                  </div>

                                  {/* Reorder Buttons */}
                                  <button
                                    title="Move Item Up"
                                    disabled={itemIdx === 0}
                                    onClick={() => moveItem(item.id, "up")}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    title="Move Item Down"
                                    disabled={itemIdx === categoryItems.length - 1}
                                    onClick={() => moveItem(item.id, "down")}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Duplicate */}
                                  <button
                                    title="Duplicate Item"
                                    onClick={() => handleDuplicateItem(item.id)}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit */}
                                  <button
                                    title="Edit Item"
                                    onClick={() => handleOpenEditItem(item)}
                                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    title="Delete Item"
                                    onClick={() =>
                                      setDeleteTarget({
                                        type: "item",
                                        id: item.id,
                                        title: "Delete Dish?",
                                        name: item.name,
                                      })
                                    }
                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {/* Add Item to this Category Button */}
                        <button
                          onClick={() => handleOpenAddItem(category.id)}
                          className="w-full py-2.5 px-3 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1.5 transition-colors bg-zinc-50/40 dark:bg-zinc-850/30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add dish to {category.name}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Simulated Mobile Phone Preview */}
        <div className={`lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 ${mobileTab === "editor" ? "hidden lg:block" : "block"}`}>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex justify-center">
            <PhonePreview
              restaurant={restaurant}
              categories={categories}
              items={items}
            />
          </div>
        </div>
      </div>

      {/* Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={async (itemData) => {
          if (editingItem) {
            await updateItem(editingItem.id, itemData);
            toast(`Updated "${itemData.name}"`, "success");
          } else {
            await addItem(itemData);
            toast(`Added "${itemData.name}" to menu`, "success");
          }
        }}
        item={editingItem}
        categories={categories}
        initialCategoryId={activeCategoryIdForItem}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={async (catName, catDesc) => {
          if (editingCategory) {
            await updateCategory(editingCategory.id, { name: catName, description: catDesc || null });
            toast(`Updated category "${catName}"`, "success");
          } else {
            const newCat = await addCategory(catName, catDesc);
            toast(`Created category "${newCat.name}"`, "success");
          }
        }}
        category={editingCategory}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title || "Confirm Delete"}
        message={
          deleteTarget?.type === "category"
            ? `Are you sure you want to delete "${deleteTarget?.name}"? All dishes in this category will also be deleted.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
      />
    </div>
  );
}
