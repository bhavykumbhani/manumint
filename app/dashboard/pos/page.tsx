"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useMenuStore } from "@/lib/store";
import { usePos } from "@/lib/pos/pos-context";
import { Order, OrderStatus, PaymentMethod, PaymentStatus, OrderItem, MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ChefHat,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Utensils,
  GlassWater,
  Receipt,
  X,
  AlertCircle,
  ShoppingBag,
  DollarSign,
  Search,
  Filter,
  ArrowRight,
  Flame,
  Check,
  Ban,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PosPage() {
  const { restaurant, categories, items } = useMenuStore();
  const {
    orders,
    serviceRequests,
    audioEnabled,
    toggleAudio,
    playChime,
    updateOrderStatus,
    updateOrderPayment,
    deleteOrder,
    placeOrder,
    resolveServiceRequest,
    loadOrdersForRestaurant,
  } = usePos();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "preparing" | "ready" | "completed">("all");
  const [kotOrder, setKotOrder] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [settlingOrder, setSettlingOrder] = useState<Order | null>(null);

  // Walk-in Direct Order Form State
  const [newOrderTable, setNewOrderTable] = useState("Table 1");
  const [newOrderCustomer, setNewOrderCustomer] = useState("");
  const [newOrderNotes, setNewOrderNotes] = useState("");
  const [newOrderItems, setNewOrderItems] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState("");

  // Load orders on restaurant mount
  useEffect(() => {
    if (restaurant?.id) {
      loadOrdersForRestaurant(restaurant.id);
    }
  }, [restaurant?.id, loadOrdersForRestaurant]);

  // If no orders exist, allow loading demo orders for instant evaluation
  const handleLoadSampleOrders = async () => {
    if (!restaurant) return;
    const sampleItems = items.slice(0, 3);
    const order1Items: OrderItem[] = sampleItems.length > 0
      ? sampleItems.map((it) => ({ id: it.id, name: it.name, price: it.price, quantity: 2 }))
      : [
          { id: "1", name: "Cold Coffee", price: 120, quantity: 2 },
          { id: "2", name: "Paneer Panini", price: 180, quantity: 1 },
        ];
    const subtotal1 = order1Items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    await placeOrder({
      restaurant_id: restaurant.id,
      table_number: "Table 4",
      customer_name: "Amit Sharma",
      items: order1Items,
      subtotal: subtotal1,
      tax: 0,
      total_amount: subtotal1,
      status: "pending",
      payment_status: "unpaid",
      payment_method: "cash",
      notes: "Extra napkins, less sugar in coffee",
    });

    await placeOrder({
      restaurant_id: restaurant.id,
      table_number: "Table 2",
      customer_name: "Priya V.",
      items: order1Items.slice(0, 1),
      subtotal: order1Items[0]?.price || 120,
      tax: 0,
      total_amount: order1Items[0]?.price || 120,
      status: "preparing",
      payment_status: "unpaid",
      payment_method: "upi",
      notes: null,
    });
  };

  // Filtered orders by restaurant
  const restaurantOrders = useMemo(() => {
    if (!restaurant) return orders;
    return orders.filter((o) => o.restaurant_id === restaurant.id);
  }, [orders, restaurant]);

  // Metrics
  const pendingOrders = restaurantOrders.filter((o) => o.status === "pending");
  const preparingOrders = restaurantOrders.filter((o) => o.status === "preparing");
  const readyOrders = restaurantOrders.filter((o) => o.status === "ready");
  const completedOrders = restaurantOrders.filter((o) => o.status === "completed");

  const pendingServiceReqs = useMemo(() => {
    if (!restaurant) return serviceRequests.filter((r) => r.status === "pending");
    return serviceRequests.filter((r) => r.restaurant_id === restaurant.id && r.status === "pending");
  }, [serviceRequests, restaurant]);

  const activeTablesCount = useMemo(() => {
    const active = restaurantOrders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
    const uniqueTables = new Set(active.map((o) => o.table_number));
    return uniqueTables.size;
  }, [restaurantOrders]);

  const todayRevenue = useMemo(() => {
    return restaurantOrders
      .filter((o) => o.payment_status === "paid" || o.status === "completed")
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  }, [restaurantOrders]);

  // Direct Order Item Management
  const handleAddItemToWalkin = (item: MenuItem) => {
    setNewOrderItems((prev) => {
      const existing = prev.find((p) => p.item.id === item.id);
      if (existing) {
        return prev.map((p) => (p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateWalkinQty = (itemId: string, delta: number) => {
    setNewOrderItems((prev) =>
      prev
        .map((p) => (p.item.id === itemId ? { ...p, quantity: p.quantity + delta } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const handlePunchDirectOrder = async () => {
    if (!restaurant) return;
    if (newOrderItems.length === 0) {
      alert("Please select at least 1 menu item.");
      return;
    }

    const orderSubtotal = newOrderItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

    await placeOrder({
      restaurant_id: restaurant.id,
      table_number: newOrderTable.trim() || "Walk-In",
      customer_name: newOrderCustomer.trim() || null,
      items: newOrderItems.map((n) => ({
        id: n.item.id,
        name: n.item.name,
        price: n.item.price,
        quantity: n.quantity,
      })),
      subtotal: orderSubtotal,
      tax: 0,
      total_amount: orderSubtotal,
      status: "preparing",
      payment_status: "unpaid",
      payment_method: "cash",
      notes: newOrderNotes.trim() || null,
    });

    // Reset Form
    setNewOrderItems([]);
    setNewOrderCustomer("");
    setNewOrderNotes("");
    setIsNewOrderModalOpen(false);
  };

  // Ticking time for pure elapsed minute calculations (refreshes every 15s)
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    setCurrentTime(Date.now());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Helper for order time elapsed
  const getElapsedMinutes = (isoString: string) => {
    if (!currentTime) return "Just now";
    const created = new Date(isoString).getTime();
    const diffMin = Math.floor((currentTime - created) / 60000);
    if (diffMin <= 0) return "Just now";
    return `${diffMin}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Audio and Walk-in controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                Live Kitchen Display & POS
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Realtime Active
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Orders from QR scans and customer tables appear here instantly with sound alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Sound Alert Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              audioEnabled
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"
            }`}
            title={audioEnabled ? "Click to Mute Kitchen Bell" : "Click to Enable Kitchen Bell"}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Kitchen Bell On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-zinc-400" />
                <span>Bell Muted</span>
              </>
            )}
          </button>

          {/* Test Sound button */}
          <button
            onClick={() => playChime("order")}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Test Chime Sound"
          >
            <BellRing className="w-4 h-4" />
          </button>

          {/* Punch Walk-in Order */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewOrderModalOpen(true)}
            className="text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Punch Direct Order
          </Button>
        </div>
      </div>

      {/* 2. Top Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Active Orders</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
              {pendingOrders.length + preparingOrders.length + readyOrders.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Active Tables</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
              {activeTablesCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Today's Sales</p>
            <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {formatCurrency(todayRevenue, restaurant?.currency || "INR")}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Table Calls</p>
            <h3 className={`text-2xl font-black font-mono mt-0.5 ${pendingServiceReqs.length > 0 ? "text-amber-500 animate-pulse" : "text-zinc-900 dark:text-zinc-100"}`}>
              {pendingServiceReqs.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Live Service Requests Alert Banner */}
      {pendingServiceReqs.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <h4 className="text-xs font-black uppercase text-amber-900 dark:text-amber-200 tracking-wider">
                Pending Table Assistance Calls ({pendingServiceReqs.length})
              </h4>
            </div>
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
              Action required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {pendingServiceReqs.map((req) => {
              const icon =
                req.request_type === "water" ? (
                  <GlassWater className="w-4 h-4 text-blue-500" />
                ) : req.request_type === "bill" ? (
                  <Receipt className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Utensils className="w-4 h-4 text-amber-500" />
                );

              const label =
                req.request_type === "water"
                  ? "Drinking Water"
                  : req.request_type === "bill"
                  ? "Final Bill"
                  : "Waiter Assistance";

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-amber-200/70 dark:border-amber-900/50 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-zinc-900 dark:text-zinc-100">
                          {req.table_number}
                        </span>
                        <span className="text-[10px] text-zinc-400">• {getElapsedMinutes(req.created_at)}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 truncate">
                        {label}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => resolveServiceRequest(req.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 transition-colors shadow-xs"
                  >
                    Attended ✓
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Empty State with Demo Generator */}
      {restaurantOrders.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No live orders currently in the queue
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              When customers scan your QR code and place an order from their phones, they will ring the kitchen chime and pop up right here in real time.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleLoadSampleOrders} className="text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Load Sample Demo Orders
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsNewOrderModalOpen(true)} className="text-xs font-bold">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Punch First Order
            </Button>
          </div>
        </div>
      )}

      {/* 5. Kanban Columns (New Orders -> Kitchen -> Ready -> Completed) */}
      {restaurantOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {/* Column 1: Incoming / New Orders */}
          <div className="bg-zinc-100/70 dark:bg-zinc-900/60 rounded-2xl p-3 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-wider">
                  New Orders ({pendingOrders.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currentTime={currentTime}
                  currency={restaurant?.currency || "INR"}
                  onAccept={() => updateOrderStatus(order.id, "preparing")}
                  onReject={() => deleteOrder(order.id)}
                  onPrintKot={() => setKotOrder(order)}
                />
              ))}
              {pendingOrders.length === 0 && (
                <div className="py-8 text-center text-zinc-400 text-xs italic">
                  No new orders waiting
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Kitchen / Preparing */}
          <div className="bg-zinc-100/70 dark:bg-zinc-900/60 rounded-2xl p-3 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-wider">
                  In Kitchen ({preparingOrders.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {preparingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currentTime={currentTime}
                  currency={restaurant?.currency || "INR"}
                  onMarkReady={() => updateOrderStatus(order.id, "ready")}
                  onPrintKot={() => setKotOrder(order)}
                />
              ))}
              {preparingOrders.length === 0 && (
                <div className="py-8 text-center text-zinc-400 text-xs italic">
                  Kitchen is all clear
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Ready / Served */}
          <div className="bg-zinc-100/70 dark:bg-zinc-900/60 rounded-2xl p-3 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-wider">
                  Ready / Served ({readyOrders.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {readyOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currentTime={currentTime}
                  currency={restaurant?.currency || "INR"}
                  onSettle={() => setSettlingOrder(order)}
                  onPrintKot={() => setKotOrder(order)}
                />
              ))}
              {readyOrders.length === 0 && (
                <div className="py-8 text-center text-zinc-400 text-xs italic">
                  No tables awaiting bill
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Completed History */}
          <div className="bg-zinc-100/70 dark:bg-zinc-900/60 rounded-2xl p-3 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-wider">
                  Completed ({completedOrders.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {completedOrders.slice(0, 10).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  currentTime={currentTime}
                  currency={restaurant?.currency || "INR"}
                  isCompleted
                  onPrintKot={() => setKotOrder(order)}
                />
              ))}
              {completedOrders.length === 0 && (
                <div className="py-8 text-center text-zinc-400 text-xs italic">
                  No completed orders yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Printable KOT Thermal Receipt Modal */}
      {kotOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setKotOrder(null)} />

          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-up text-black">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                Kitchen Order Ticket (KOT)
              </h3>
              <button
                onClick={() => setKotOrder(null)}
                className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Ticket Preview Container (targets #printable-kot in print stylesheet) */}
            <div id="printable-kot" className="border border-dashed border-zinc-300 p-4 bg-zinc-50 rounded-xl font-mono text-xs space-y-2">
              <div className="text-center border-b border-dashed border-zinc-400 pb-2">
                <h4 className="font-black text-sm uppercase">{restaurant?.name || "MANUMAKER KITCHEN"}</h4>
                <p className="text-[11px]">*** KITCHEN ORDER TICKET ***</p>
                <div className="flex justify-between text-[11px] font-bold mt-1">
                  <span>ORDER #{kotOrder.order_number}</span>
                  <span>{kotOrder.table_number}</span>
                </div>
                <p className="text-[10px] text-zinc-500">{new Date(kotOrder.created_at).toLocaleString()}</p>
              </div>

              {kotOrder.customer_name && (
                <p className="text-[11px] font-bold">Guest: {kotOrder.customer_name}</p>
              )}

              <div className="border-b border-dashed border-zinc-400 py-2 space-y-1.5">
                <div className="flex justify-between font-bold text-[11px]">
                  <span>QTY / ITEM</span>
                  <span>PRICE</span>
                </div>
                {kotOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="font-bold">
                      {item.quantity}x {item.name}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity, restaurant?.currency || "INR")}</span>
                  </div>
                ))}
              </div>

              {kotOrder.notes && (
                <div className="border-b border-dashed border-zinc-400 py-1 text-[11px] text-red-600 font-bold">
                  NOTE: {kotOrder.notes}
                </div>
              )}

              <div className="pt-1 flex justify-between font-black text-sm">
                <span>TOTAL:</span>
                <span>{formatCurrency(kotOrder.total_amount, restaurant?.currency || "INR")}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => window.print()}
                className="w-full font-bold text-xs"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Ticket (Thermal 58/80mm)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Walk-in Order Punch Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsNewOrderModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-scale-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                    Punch Direct Order (Cashier / Walk-in)
                  </h3>
                  <p className="text-[11px] text-zinc-500">Add dishes directly to live kitchen display</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center hover:bg-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Table and Customer row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Table / Seating *
                </label>
                <input
                  type="text"
                  value={newOrderTable}
                  onChange={(e) => setNewOrderTable(e.target.value)}
                  placeholder="e.g. Table 4 or Takeaway"
                  className="w-full px-3 py-1.5 text-xs font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={newOrderCustomer}
                  onChange={(e) => setNewOrderCustomer(e.target.value)}
                  placeholder="e.g. Vicky"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dish selector with search */}
            <div className="space-y-2 flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  placeholder="Search dishes to add..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Items List to pick */}
              <div className="flex-1 overflow-y-auto space-y-1.5 border border-zinc-100 dark:border-zinc-800 rounded-xl p-2 max-h-48">
                {items
                  .filter((it) =>
                    itemSearchQuery.trim()
                      ? it.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
                      : true
                  )
                  .map((it) => {
                    const picked = newOrderItems.find((p) => p.item.id === it.id);
                    return (
                      <div
                        key={it.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{it.name}</p>
                          <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            {formatCurrency(it.price, restaurant?.currency || "INR")}
                          </p>
                        </div>

                        {picked ? (
                          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-lg">
                            <button
                              onClick={() => handleUpdateWalkinQty(it.id, -1)}
                              className="w-5 h-5 rounded bg-white dark:bg-zinc-600 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold w-4 text-center">{picked.quantity}</span>
                            <button
                              onClick={() => handleUpdateWalkinQty(it.id, 1)}
                              className="w-5 h-5 rounded bg-white dark:bg-zinc-600 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddItemToWalkin(it)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Special notes */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
                Special Kitchen Notes (Optional)
              </label>
              <input
                type="text"
                value={newOrderNotes}
                onChange={(e) => setNewOrderNotes(e.target.value)}
                placeholder="e.g. Less oil, pack separately"
                className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Summary & Punch */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-500">Order Total:</span>
                <p className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(
                    newOrderItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0),
                    restaurant?.currency || "INR"
                  )}
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handlePunchDirectOrder}
                className="font-bold text-xs px-5 shadow-lg"
              >
                Punch to Kitchen ➔
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Settle Bill & Payment Modal */}
      {settlingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSettlingOrder(null)} />

          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  Settle Bill — Order #{settlingOrder.order_number}
                </h3>
                <p className="text-[11px] text-zinc-500">{settlingOrder.table_number}</p>
              </div>
              <button
                onClick={() => setSettlingOrder(null)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center space-y-1">
              <span className="text-xs text-zinc-500 font-semibold">Total Bill Amount</span>
              <h2 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(settlingOrder.total_amount, restaurant?.currency || "INR")}
              </h2>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Choose Payment Method Received:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(["cash", "upi", "card"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={async () => {
                      await updateOrderPayment(settlingOrder.id, "paid", method);
                      await updateOrderStatus(settlingOrder.id, "completed");
                      setSettlingOrder(null);
                    }}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold uppercase transition-all flex flex-col items-center gap-1 text-zinc-800 dark:text-zinc-200"
                  >
                    <span>{method}</span>
                    <span className="text-[10px] text-emerald-600 font-normal">Settle ✓</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-component: OrderCard (Kanban Card)
// ----------------------------------------------------------------------
interface OrderCardProps {
  order: Order;
  currency: string;
  isCompleted?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkReady?: () => void;
  onSettle?: () => void;
  onPrintKot?: () => void;
  currentTime?: number;
}

function OrderCard({
  order,
  currency,
  isCompleted = false,
  onAccept,
  onReject,
  onMarkReady,
  onSettle,
  onPrintKot,
  currentTime = 0,
}: OrderCardProps) {
  const created = new Date(order.created_at).getTime();
  const diffMin = currentTime > 0 ? Math.floor((currentTime - created) / 60000) : 0;
  const timeText = !currentTime || diffMin <= 0 ? "Just now" : `${diffMin}m ago`;

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-2xl p-3.5 border shadow-xs transition-all space-y-3 ${
        order.status === "pending"
          ? "border-amber-300 dark:border-amber-800 shadow-amber-500/5 ring-1 ring-amber-400/20"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      {/* Card Header: Table #, Order #, Time */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            {order.table_number}
          </span>
          <span className="font-mono text-[11px] font-bold text-zinc-400">
            #{order.order_number}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-500">{timeText}</span>
        </div>
      </div>

      {/* Customer Name if present */}
      {order.customer_name && (
        <div className="text-[11px] font-semibold text-zinc-500">
          Guest: <span className="text-zinc-800 dark:text-zinc-200">{order.customer_name}</span>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-1 text-xs divide-y divide-zinc-50 dark:divide-zinc-850">
        {order.items.map((item, idx) => (
          <div key={idx} className="pt-1 first:pt-0 flex items-center justify-between gap-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 mr-1">
                {item.quantity}x
              </span>
              {item.name}
            </span>
            <span className="font-mono text-[11px] text-zinc-400 shrink-0">
              {formatCurrency(item.price * item.quantity, currency)}
            </span>
          </div>
        ))}
      </div>

      {/* Customer / Chef Notes */}
      {order.notes && (
        <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
          📝 {order.notes}
        </div>
      )}

      {/* Total & Action footer */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total</span>
          <span className="font-mono font-black text-xs text-zinc-900 dark:text-zinc-100">
            {formatCurrency(order.total_amount, currency)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onPrintKot && (
            <button
              onClick={onPrintKot}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Print KOT"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Pending State Actions */}
          {order.status === "pending" && (
            <>
              {onReject && (
                <button
                  onClick={onReject}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Reject / Cancel Order"
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              )}
              {onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onAccept}
                  className="text-[11px] font-bold py-1 px-2.5 h-7 bg-emerald-600 hover:bg-emerald-500"
                >
                  Accept ➔
                </Button>
              )}
            </>
          )}

          {/* Preparing State Action */}
          {order.status === "preparing" && onMarkReady && (
            <Button
              variant="primary"
              size="sm"
              onClick={onMarkReady}
              className="text-[11px] font-bold py-1 px-2.5 h-7 bg-blue-600 hover:bg-blue-500"
            >
              Ready ✓
            </Button>
          )}

          {/* Ready State Action */}
          {order.status === "ready" && onSettle && (
            <Button
              variant="primary"
              size="sm"
              onClick={onSettle}
              className="text-[11px] font-bold py-1 px-2.5 h-7 bg-emerald-600 hover:bg-emerald-500"
            >
              Settle Bill 💵
            </Button>
          )}

          {/* Completed Badge */}
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" /> Paid ({order.payment_method})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
