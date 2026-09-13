import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import { Category, FullRestaurantData, MenuItem, Restaurant } from "@/types";
import { DEMO_CATEGORIES, DEMO_ITEMS, DEMO_RESTAURANT } from "@/lib/demo-data";

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !isSupabaseConfigured()) {
    return null;
  }

  return createSupabaseJsClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Fetch a restaurant and its complete visible menu by slug from Supabase.
 * Falls back to demo restaurant or null if not found.
 */
export async function getPublicRestaurantBySlug(slug: string): Promise<FullRestaurantData | null> {
  const cleanSlug = slug.toLowerCase().trim();

  // If Supabase is configured, fetch from cloud database
  const client = getPublicClient();
  if (client) {
    try {
      const { data: restaurant, error: restError } = await client
        .from("restaurants")
        .select("*")
        .eq("slug", cleanSlug)
        .maybeSingle();

      if (restError) {
        console.error("Error fetching restaurant by slug:", restError);
      }

      if (restaurant) {
        const { data: categories, error: catError } = await client
          .from("categories")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .eq("is_visible", true)
          .order("position", { ascending: true });

        if (catError) {
          console.error("Error fetching categories:", catError);
        }

        const { data: items, error: itemError } = await client
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .eq("is_visible", true)
          .order("position", { ascending: true });

        if (itemError) {
          console.error("Error fetching items:", itemError);
        }

        const validCategories = (categories as Category[]) || [];
        const validItems = (items as MenuItem[]) || [];

        const categoriesWithItems = validCategories.map((cat) => ({
          ...cat,
          items: validItems
            .filter((i) => i.category_id === cat.id)
            .sort((a, b) => a.position - b.position),
        }));

        return {
          restaurant: restaurant as Restaurant,
          categories: categoriesWithItems,
        };
      }
    } catch (err) {
      console.error("Supabase query failed in getPublicRestaurantBySlug:", err);
    }
  }

  // Fallback to demo restaurant if slug matches
  if (cleanSlug === DEMO_RESTAURANT.slug.toLowerCase()) {
    const demoCategories = DEMO_CATEGORIES.map((cat) => ({
      ...cat,
      items: DEMO_ITEMS.filter((i) => i.category_id === cat.id && i.is_visible).sort(
        (a, b) => a.position - b.position
      ),
    }));

    return {
      restaurant: DEMO_RESTAURANT,
      categories: demoCategories,
    };
  }

  return null;
}

/**
 * Record a menu view for analytics in Supabase.
 */
export async function recordMenuView(
  restaurantId: string,
  referrer?: string,
  userAgent?: string
) {
  const client = getPublicClient();
  if (!client) return;

  try {
    await client.from("menu_views").insert({
      restaurant_id: restaurantId,
      referrer: referrer || null,
      user_agent: userAgent || null,
    });
  } catch (err) {
    // Non-blocking analytics fail
    console.error("Failed to record menu view:", err);
  }
}
