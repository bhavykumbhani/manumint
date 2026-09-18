"use client";

import React, { useState } from "react";
import { MenuItem, Restaurant } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  MessageCircle,
  Bell,
  Trash2,
  Utensils,
  GlassWater,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartTrayProps {
  restaurant: Restaurant;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export function CartTray({
  restaurant,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartTrayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const totalItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const rawWhatsapp = restaurant.whatsapp ? restaurant.whatsapp.replace(/[^0-9]/g, "") : "";

  // WhatsApp Order Link Generator
  const handleSendOrder = () => {
    if (!rawWhatsapp) {
      alert("Restaurant WhatsApp contact is not configured.");
      return;
    }

    const itemsSummary = cart
      .map(
        (c) =>
          `• ${c.quantity}x ${c.item.name} (${formatCurrency(
            c.item.price * c.quantity,
            restaurant.currency
          )})`
      )
      .join("\n");

    const message = [
      `🍽️ *NEW ORDER — ${restaurant.name}*`,
      tableNumber ? `📍 *Table / Seating:* Table ${tableNumber}` : `📍 *Order:* Dine-In`,
      `────────────────────────`,
      itemsSummary,
      `────────────────────────`,
      `💵 *Total Amount:* ${formatCurrency(subtotal, restaurant.currency)}`,
      specialNotes.trim() ? `📝 *Special Notes:* ${specialNotes.trim()}` : "",
      `\n_Sent via ManuMaker Digital Menu_`,
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  // WhatsApp Waiter Call Generator
  const handleCallWaiter = (type: "waiter" | "water" | "bill") => {
    if (!rawWhatsapp) {
      alert("Restaurant WhatsApp contact is not configured.");
      return;
    }

    const serviceTitle =
      type === "water"
        ? "Drinking Water requested"
        : type === "bill"
        ? "Final Bill requested"
        : "Staff assistance requested";

    const message = [
      `🛎️ *TABLE SERVICE REQUEST — ${restaurant.name}*`,
      tableNumber ? `📍 *Table:* Table ${tableNumber}` : `📍 *Table:* Table assistance`,
      `📌 *Request:* ${serviceTitle}`,
      `\n_Sent via ManuMaker Contactless Menu_`,
    ].join("\n");

    const waUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setIsWaiterModalOpen(false);
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto flex items-center gap-2 max-w-lg w-full">
          {/* Quick Call Waiter Button */}
          {restaurant.whatsapp && (
            <button
              onClick={() => setIsWaiterModalOpen(true)}
              className="px-3.5 py-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 shadow-xl text-zinc-800 dark:text-zinc-100 flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
              title="Call Waiter / Request Bill"
            >
              <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
              <span className="hidden sm:inline">Call Staff</span>
            </button>
          )}

          {/* Cart Tray Floating Trigger */}
          {totalItemCount > 0 && (
            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-between font-bold text-xs active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-800/80 flex items-center justify-center text-[11px] font-black">
                  {totalItemCount}
                </div>
                <span>View Order Tray</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-sm">
                <span>{formatCurrency(subtotal, restaurant.currency)}</span>
                <span className="text-emerald-200">→</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Cart Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-850/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  Your Table Order Tray ({totalItemCount})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClearCart}
                  className="text-[11px] font-semibold text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  Clear Tray
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:scale-105"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dish Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      {formatCurrency(item.price, restaurant.currency)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 shrink-0 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shadow-xs hover:bg-zinc-200 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 shadow-xs hover:bg-zinc-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Total item price */}
                  <span className="w-14 text-right text-xs font-black font-mono text-zinc-900 dark:text-zinc-100 shrink-0">
                    {formatCurrency(item.price * quantity, restaurant.currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Table Details & Special Notes */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-850/50 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                    Table No. *
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                    Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Less spicy, extra sauce"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subtotal row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-zinc-500">Order Subtotal</span>
                <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(subtotal, restaurant.currency)}
                </span>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSendOrder}
                className="w-full shadow-lg font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Order to Kitchen via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Waiter Service Modal */}
      {isWaiterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsWaiterModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Call Restaurant Staff
                </h3>
              </div>
              <button
                onClick={() => setIsWaiterModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Your Table Number
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 5"
                className="w-full px-3.5 py-2 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleCallWaiter("waiter")}
                className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 flex items-center gap-3 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Call Waiter to Table</h4>
                  <p className="text-[11px] text-zinc-500">Need assistance or recommendations</p>
                </div>
              </button>

              <button
                onClick={() => handleCallWaiter("water")}
                className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                  <GlassWater className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Request Water</h4>
                  <p className="text-[11px] text-zinc-500">Bottled or drinking water</p>
                </div>
              </button>

              <button
                onClick={() => handleCallWaiter("bill")}
                className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 flex items-center gap-3 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Request Final Bill</h4>
                  <p className="text-[11px] text-zinc-500">Ready to pay and checkout</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
