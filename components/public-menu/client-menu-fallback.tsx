"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMenuStore } from "@/lib/store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Category, FullRestaurantData, MenuItem, Restaurant } from "@/types";
import { PublicMenuView } from "@/components/public-menu/public-menu-view";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientMenuFallback({ slug }: { slug: string }) {
  const { getPublicRestaurant, isLoading: storeLoading } = useMenuStore();
  const [cloudData, setCloudData] = useState<FullRestaurantData | null>(null);
  const [isFetchingCloud, setIsFetchingCloud] = useState(true);

  const localData = getPublicRestaurant(slug);

  useEffect(() => {
    let isMounted = true;

    async function fetchFromSupabase() {
      if (localData) {
        setIsFetchingCloud(false);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setIsFetchingCloud(false);
        return;
      }

      try {
        const cleanSlug = slug.toLowerCase().trim();
        const { data: rest, error: restError } = await supabase
          .from("restaurants")
          .select("*")
          .ilike("slug", cleanSlug)
          .maybeSingle();

        if (restError || !rest) {
          if (isMounted) setIsFetchingCloud(false);
          return;
        }

        const { data: cats } = await supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", rest.id)
          .eq("is_visible", true)
          .order("position", { ascending: true });

        const { data: itms } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", rest.id)
          .eq("is_visible", true)
          .order("position", { ascending: true });

        const validCats = (cats as Category[]) || [];
        const validItms = (itms as MenuItem[]) || [];

        const fullCats = validCats.map((c) => ({
          ...c,
          items: validItms.filter((i) => i.category_id === c.id).sort((a, b) => a.position - b.position),
        }));

        if (isMounted) {
          setCloudData({
            restaurant: rest as Restaurant,
            categories: fullCats,
          });
        }
      } catch (e) {
        console.error("ClientMenuFallback error:", e);
      } finally {
        if (isMounted) setIsFetchingCloud(false);
      }
    }

    fetchFromSupabase();

    return () => {
      isMounted = false;
    };
  }, [slug, localData]);

  const activeData = localData || cloudData;

  if (storeLoading || (isFetchingCloud && !activeData)) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-zinc-500">Opening menu...</p>
      </div>
    );
  }

  if (!activeData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Restaurant Menu Not Found</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
          The menu for <span className="font-mono text-zinc-700 dark:text-zinc-300">&quot;{slug}&quot;</span> doesn&apos;t exist or is currently unpublished.
        </p>
        <Link href="/">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Go to MenuMint
          </Button>
        </Link>
      </div>
    );
  }

  return <PublicMenuView data={activeData} />;
}
