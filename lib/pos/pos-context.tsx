"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { Order, OrderStatus, PaymentStatus, PaymentMethod, ServiceRequest, ServiceRequestType } from "@/types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { safeUUID } from "@/lib/utils";

// Web Audio API Synthesizer for Kitchen Bell & Service Chime
function playSynthesizedChime(type: "order" | "service" = "order") {
  if (typeof window === "undefined") return;

  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    const ctx = new AudioCtxClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === "order") {
      // 2-Tone Kitchen Order Chime (A5 -> E6 high ding-dong)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1318.5, now + 0.15); // E6
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.9);
    } else {
      // Service call (waiter/water/bill) alert (D5 -> A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.12); // A5
      gain2.gain.setValueAtTime(0.3, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);
    }
  } catch (err) {
    console.debug("Web Audio chime not supported or muted:", err);
  }
}

interface PosContextType {
  orders: Order[];
  serviceRequests: ServiceRequest[];
  pendingOrdersCount: number;
  pendingRequestsCount: number;
  audioEnabled: boolean;
  toggleAudio: () => void;
  playChime: (type?: "order" | "service") => void;
  placeOrder: (orderData: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderPayment: (orderId: string, paymentStatus: PaymentStatus, method?: PaymentMethod) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  requestService: (restaurantId: string, tableNumber: string, type: ServiceRequestType) => Promise<ServiceRequest>;
  resolveServiceRequest: (requestId: string) => Promise<void>;
  loadOrdersForRestaurant: (restaurantId: string) => Promise<void>;
}

const PosContext = createContext<PosContextType | null>(null);

const STORAGE_ORDERS_PREFIX = "manumaker_orders_v1";
const STORAGE_SERVICES_PREFIX = "manumaker_services_v1";
const BROADCAST_CHANNEL_NAME = "manumaker_pos_sync";

export function PosProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const activeRestaurantIdRef = useRef<string | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Initialize audio preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("manumaker_pos_sound");
      if (stored !== null) {
        setAudioEnabled(stored === "true");
      }
    }
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("manumaker_pos_sound", String(next));
      }
      return next;
    });
  }, []);

  const playChime = useCallback(
    (type: "order" | "service" = "order") => {
      if (audioEnabled) {
        playSynthesizedChime(type);
      }
    },
    [audioEnabled]
  );

  // Set up Cross-Tab Sync via BroadcastChannel
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || !data.type) return;

        if (data.type === "NEW_ORDER" && data.order) {
          setOrders((prev) => {
            if (prev.some((o) => o.id === data.order.id)) return prev;
            return [data.order, ...prev];
          });
          playChime("order");
        } else if (data.type === "UPDATE_ORDER_STATUS" && data.orderId) {
          setOrders((prev) =>
            prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status, updated_at: new Date().toISOString() } : o))
          );
        } else if (data.type === "UPDATE_ORDER_PAYMENT" && data.orderId) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === data.orderId
                ? {
                    ...o,
                    payment_status: data.paymentStatus,
                    payment_method: data.paymentMethod || o.payment_method,
                    updated_at: new Date().toISOString(),
                  }
                : o
            )
          );
        } else if (data.type === "DELETE_ORDER" && data.orderId) {
          setOrders((prev) => prev.filter((o) => o.id !== data.orderId));
        } else if (data.type === "NEW_SERVICE_REQUEST" && data.request) {
          setServiceRequests((prev) => {
            if (prev.some((r) => r.id === data.request.id)) return prev;
            return [data.request, ...prev];
          });
          playChime("service");
        } else if (data.type === "RESOLVE_SERVICE_REQUEST" && data.requestId) {
          setServiceRequests((prev) =>
            prev.map((r) => (r.id === data.requestId ? { ...r, status: "attended" } : r))
          );
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      // BroadcastChannel unavailable
    }
  }, [playChime]);

  // Load orders for specific restaurant
  const loadOrdersForRestaurant = useCallback(async (restaurantId: string) => {
    if (!restaurantId) return;
    activeRestaurantIdRef.current = restaurantId;

    // 1. Load from localStorage cache
    if (typeof window !== "undefined") {
      try {
        const cachedOrders = localStorage.getItem(`${STORAGE_ORDERS_PREFIX}_${restaurantId}`);
        if (cachedOrders) {
          setOrders(JSON.parse(cachedOrders));
        }
        const cachedReqs = localStorage.getItem(`${STORAGE_SERVICES_PREFIX}_${restaurantId}`);
        if (cachedReqs) {
          setServiceRequests(JSON.parse(cachedReqs));
        }
      } catch {
        // ignore JSON parse error
      }
    }

    // 2. Fetch from Supabase if connected
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: dbOrders, error: orderErr } = await supabase
          .from("orders")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false })
          .limit(100);

        if (!orderErr && dbOrders && dbOrders.length > 0) {
          const formatted: Order[] = (dbOrders as unknown as Record<string, unknown>[]).map((o) => ({
            id: String(o.id),
            restaurant_id: String(o.restaurant_id),
            order_number: Number(o.order_number) || 0,
            table_number: String(o.table_number || "Takeaway"),
            customer_name: o.customer_name ? String(o.customer_name) : null,
            customer_phone: o.customer_phone ? String(o.customer_phone) : null,
            items: typeof o.items === "string" ? JSON.parse(o.items) : (o.items as Order["items"]),
            subtotal: Number(o.subtotal) || 0,
            tax: Number(o.tax) || 0,
            total_amount: Number(o.total_amount) || 0,
            status: (o.status as OrderStatus) || "pending",
            payment_status: (o.payment_status as PaymentStatus) || "unpaid",
            payment_method: (o.payment_method as PaymentMethod) || "cash",
            notes: o.notes ? String(o.notes) : null,
            created_at: String(o.created_at || new Date().toISOString()),
            updated_at: o.updated_at ? String(o.updated_at) : undefined,
          }));
          setOrders(formatted);
          if (typeof window !== "undefined") {
            localStorage.setItem(`${STORAGE_ORDERS_PREFIX}_${restaurantId}`, JSON.stringify(formatted));
          }
        }

        const { data: dbReqs, error: reqErr } = await supabase
          .from("service_requests")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false })
          .limit(50);

        if (!reqErr && dbReqs && dbReqs.length > 0) {
          setServiceRequests(dbReqs as ServiceRequest[]);
          if (typeof window !== "undefined") {
            localStorage.setItem(`${STORAGE_SERVICES_PREFIX}_${restaurantId}`, JSON.stringify(dbReqs));
          }
        }
      } catch (err) {
        console.debug("Supabase load orders error:", err);
      }
    }
  }, []);

  // Supabase Realtime channel setup
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!isSupabaseConfigured() || !supabase) return;

    const channel = supabase
      .channel("pos_realtime_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload: { new: Record<string, unknown> }) => {
          const raw = payload.new;
          if (activeRestaurantIdRef.current && raw.restaurant_id !== activeRestaurantIdRef.current) return;

          const newOrder: Order = {
            id: String(raw.id),
            restaurant_id: String(raw.restaurant_id),
            order_number: Number(raw.order_number) || Math.floor(100 + Math.random() * 900),
            table_number: String(raw.table_number || "Takeaway"),
            customer_name: raw.customer_name ? String(raw.customer_name) : null,
            customer_phone: raw.customer_phone ? String(raw.customer_phone) : null,
            items: typeof raw.items === "string" ? JSON.parse(raw.items as string) : (raw.items as Order["items"]),
            subtotal: Number(raw.subtotal) || 0,
            tax: Number(raw.tax) || 0,
            total_amount: Number(raw.total_amount) || 0,
            status: (raw.status as OrderStatus) || "pending",
            payment_status: (raw.payment_status as PaymentStatus) || "unpaid",
            payment_method: (raw.payment_method as PaymentMethod) || "cash",
            notes: raw.notes ? String(raw.notes) : null,
            created_at: String(raw.created_at || new Date().toISOString()),
            updated_at: raw.updated_at ? String(raw.updated_at) : undefined,
          };

          setOrders((prev) => {
            if (prev.some((o) => o.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
          playChime("order");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload: { new: Record<string, unknown> }) => {
          const raw = payload.new;
          if (activeRestaurantIdRef.current && raw.restaurant_id !== activeRestaurantIdRef.current) return;

          setOrders((prev) =>
            prev.map((o) => (o.id === raw.id ? { ...o, ...(raw as unknown as Partial<Order>) } : o))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "service_requests" },
        (payload: { new: Record<string, unknown> }) => {
          const raw = payload.new;
          if (activeRestaurantIdRef.current && raw.restaurant_id !== activeRestaurantIdRef.current) return;

          const newReq: ServiceRequest = {
            id: String(raw.id),
            restaurant_id: String(raw.restaurant_id),
            table_number: String(raw.table_number),
            request_type: raw.request_type as ServiceRequestType,
            status: raw.status as ServiceRequest["status"],
            created_at: String(raw.created_at || new Date().toISOString()),
          };

          setServiceRequests((prev) => {
            if (prev.some((r) => r.id === newReq.id)) return prev;
            return [newReq, ...prev];
          });
          playChime("service");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "service_requests" },
        (payload: { new: Record<string, unknown> }) => {
          const raw = payload.new;
          setServiceRequests((prev) =>
            prev.map((r) => (r.id === raw.id ? { ...r, status: raw.status as ServiceRequest["status"] } : r))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playChime]);

  // Persist orders to localStorage
  const persistOrdersLocally = useCallback((updatedOrders: Order[], restaurantId: string) => {
    if (typeof window === "undefined" || !restaurantId) return;
    try {
      localStorage.setItem(`${STORAGE_ORDERS_PREFIX}_${restaurantId}`, JSON.stringify(updatedOrders));
    } catch {
      // storage quota
    }
  }, []);

  // Place Order (from Customer Cart Tray or Direct Walk-in)
  const placeOrder = useCallback(
    async (orderData: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">): Promise<Order> => {
      const orderId = safeUUID();
      const orderNumber = Math.floor(100 + (Date.now() % 900));
      const now = new Date().toISOString();

      const newOrder: Order = {
        ...orderData,
        id: orderId,
        order_number: orderNumber,
        status: orderData.status || "pending",
        payment_status: orderData.payment_status || "unpaid",
        payment_method: orderData.payment_method || "cash",
        created_at: now,
        updated_at: now,
      };

      // 1. Update React state immediately
      setOrders((prev) => {
        const next = [newOrder, ...prev];
        persistOrdersLocally(next, orderData.restaurant_id);
        return next;
      });

      // 2. Broadcast to other tabs
      try {
        broadcastChannelRef.current?.postMessage({
          type: "NEW_ORDER",
          order: newOrder,
        });
      } catch {
        // channel error
      }

      // 3. Play chime
      playChime("order");

      // 4. Save to Supabase Cloud
      const supabase = getSupabaseBrowserClient();
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from("orders").insert([
            {
              id: newOrder.id,
              restaurant_id: newOrder.restaurant_id,
              table_number: newOrder.table_number,
              customer_name: newOrder.customer_name || null,
              customer_phone: newOrder.customer_phone || null,
              items: newOrder.items,
              subtotal: newOrder.subtotal,
              tax: newOrder.tax,
              total_amount: newOrder.total_amount,
              status: newOrder.status,
              payment_status: newOrder.payment_status,
              payment_method: newOrder.payment_method,
              notes: newOrder.notes || null,
            },
          ]);
        } catch (err) {
          console.error("Failed to insert order into Supabase:", err);
        }
      }

      return newOrder;
    },
    [persistOrdersLocally, playChime]
  );

  // Update Order Status (e.g. pending -> preparing -> ready -> served -> completed)
  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setOrders((prev) => {
        const next = prev.map((o) => (o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o));
        const restId = activeRestaurantIdRef.current;
        if (restId) persistOrdersLocally(next, restId);
        return next;
      });

      try {
        broadcastChannelRef.current?.postMessage({
          type: "UPDATE_ORDER_STATUS",
          orderId,
          status,
        });
      } catch {
        // channel error
      }

      const supabase = getSupabaseBrowserClient();
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase
            .from("orders")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", orderId);
        } catch (err) {
          console.error("Failed to update order status in Supabase:", err);
        }
      }
    },
    [persistOrdersLocally]
  );

  // Update Payment Status
  const updateOrderPayment = useCallback(
    async (orderId: string, paymentStatus: PaymentStatus, method?: PaymentMethod) => {
      setOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                payment_status: paymentStatus,
                payment_method: method || o.payment_method,
                updated_at: new Date().toISOString(),
              }
            : o
        );
        const restId = activeRestaurantIdRef.current;
        if (restId) persistOrdersLocally(next, restId);
        return next;
      });

      try {
        broadcastChannelRef.current?.postMessage({
          type: "UPDATE_ORDER_PAYMENT",
          orderId,
          paymentStatus,
          paymentMethod: method,
        });
      } catch {
        // channel error
      }

      const supabase = getSupabaseBrowserClient();
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase
            .from("orders")
            .update({
              payment_status: paymentStatus,
              payment_method: method || "cash",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
        } catch (err) {
          console.error("Failed to update payment status in Supabase:", err);
        }
      }
    },
    [persistOrdersLocally]
  );

  // Delete / Cancel Order
  const deleteOrder = useCallback(
    async (orderId: string) => {
      setOrders((prev) => {
        const next = prev.filter((o) => o.id !== orderId);
        const restId = activeRestaurantIdRef.current;
        if (restId) persistOrdersLocally(next, restId);
        return next;
      });

      try {
        broadcastChannelRef.current?.postMessage({
          type: "DELETE_ORDER",
          orderId,
        });
      } catch {
        // channel error
      }

      const supabase = getSupabaseBrowserClient();
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from("orders").delete().eq("id", orderId);
        } catch (err) {
          console.error("Failed to delete order from Supabase:", err);
        }
      }
    },
    [persistOrdersLocally]
  );

  // Table Service Request (Waiter, Water, Bill)
  const requestService = useCallback(
    async (restaurantId: string, tableNumber: string, type: ServiceRequestType): Promise<ServiceRequest> => {
      const reqId = safeUUID();
      const now = new Date().toISOString();

      const newReq: ServiceRequest = {
        id: reqId,
        restaurant_id: restaurantId,
        table_number: tableNumber,
        request_type: type,
        status: "pending",
        created_at: now,
      };

      setServiceRequests((prev) => {
        const next = [newReq, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem(`${STORAGE_SERVICES_PREFIX}_${restaurantId}`, JSON.stringify(next));
        }
        return next;
      });

      try {
        broadcastChannelRef.current?.postMessage({
          type: "NEW_SERVICE_REQUEST",
          request: newReq,
        });
      } catch {
        // channel error
      }

      playChime("service");

      const supabase = getSupabaseBrowserClient();
      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase.from("service_requests").insert([
            {
              id: newReq.id,
              restaurant_id: newReq.restaurant_id,
              table_number: newReq.table_number,
              request_type: newReq.request_type,
              status: newReq.status,
            },
          ]);
        } catch (err) {
          console.error("Failed to insert service request into Supabase:", err);
        }
      }

      return newReq;
    },
    [playChime]
  );

  // Resolve Service Request
  const resolveServiceRequest = useCallback(async (requestId: string) => {
    setServiceRequests((prev) => {
      const next = prev.map((r) => (r.id === requestId ? { ...r, status: "attended" as const } : r));
      const restId = activeRestaurantIdRef.current;
      if (restId && typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_SERVICES_PREFIX}_${restId}`, JSON.stringify(next));
      }
      return next;
    });

    try {
      broadcastChannelRef.current?.postMessage({
        type: "RESOLVE_SERVICE_REQUEST",
        requestId,
      });
    } catch {
      // channel error
    }

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("service_requests").update({ status: "attended" }).eq("id", requestId);
      } catch (err) {
        console.error("Failed to resolve service request in Supabase:", err);
      }
    }
  }, []);

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const pendingRequestsCount = serviceRequests.filter((r) => r.status === "pending").length;

  return (
    <PosContext.Provider
      value={{
        orders,
        serviceRequests,
        pendingOrdersCount,
        pendingRequestsCount,
        audioEnabled,
        toggleAudio,
        playChime,
        placeOrder,
        updateOrderStatus,
        updateOrderPayment,
        deleteOrder,
        requestService,
        resolveServiceRequest,
        loadOrdersForRestaurant,
      }}
    >
      {children}
    </PosContext.Provider>
  );
}

export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error("usePos must be used within a PosProvider");
  }
  return context;
}
