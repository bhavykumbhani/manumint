"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Category, FullRestaurantData, MenuItem, Profile, Restaurant, TemplateKey } from "@/types";
import { DEMO_CATEGORIES, DEMO_ITEMS, DEMO_OWNER_ID, DEMO_RESTAURANT, DEMO_RESTAURANT_ID } from "@/lib/demo-data";
import { generateSlug } from "@/lib/utils";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface MenuStoreContextType {
  user: Profile | null;
  restaurant: Restaurant | null;
  categories: Category[];
  items: MenuItem[];
  isLoading: boolean;
  isCloudConnected: boolean;

  // Auth methods
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchAccount: (email: string, fullName?: string) => void;

  // Restaurant methods
  createRestaurant: (data: Partial<Restaurant>) => Promise<Restaurant>;
  updateRestaurant: (updates: Partial<Restaurant>) => Promise<void>;
  publishRestaurant: () => Promise<{ success: boolean; error?: string }>;
  setTemplate: (template: TemplateKey) => Promise<void>;

  // Category methods
  addCategory: (name: string, description?: string, targetRestaurantId?: string) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  moveCategory: (id: string, direction: "up" | "down") => Promise<void>;

  // Item methods
  addItem: (
    item: Omit<MenuItem, "id" | "restaurant_id" | "position" | "created_at" | "updated_at">,
    targetRestaurantId?: string
  ) => Promise<MenuItem>;
  updateItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  duplicateItem: (id: string) => Promise<MenuItem>;
  moveItem: (id: string, direction: "up" | "down") => Promise<void>;
  toggleItemAvailability: (id: string) => Promise<void>;
  toggleItemVisibility: (id: string) => Promise<void>;

  // Public retrieval
  getPublicRestaurant: (slug: string) => FullRestaurantData | null;
  refreshData: () => Promise<void>;
}

const STORAGE_KEY_PREFIX = "menumint_v1";

const MenuStoreContext = createContext<MenuStoreContextType | undefined>(undefined);

function createStarterRestaurantForUser(user: Profile): {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
} {
  const displayName = user.full_name || user.email.split("@")[0] || "My";
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const restName = `${capitalizedName}'s Cafe`;
  const restSlug = `${generateSlug(capitalizedName)}-cafe-${Math.floor(100 + Math.random() * 900)}`;

  const newRest: Restaurant = {
    id: `rest-${Date.now()}`,
    owner_id: user.id,
    name: restName,
    slug: restSlug,
    description: `Welcome to ${restName}! Explore our chef-crafted menu.`,
    restaurant_type: "Café",
    logo_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80",
    cover_image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    whatsapp: "+919876543210",
    instagram: null,
    address: "Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    currency: "INR",
    template_key: "cafe",
    primary_color: "#10B981",
    secondary_color: "#047857",
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const starterCat1: Category = {
    id: `cat-${Date.now()}-1`,
    restaurant_id: newRest.id,
    name: "Artisanal Beverages",
    description: "Freshly brewed coffees and refreshing drinks",
    position: 0,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const starterCat2: Category = {
    id: `cat-${Date.now()}-2`,
    restaurant_id: newRest.id,
    name: "Chef's Specials",
    description: "Popular handcrafted snacks and meals",
    position: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const starterItem1: MenuItem = {
    id: `item-${Date.now()}-1`,
    restaurant_id: newRest.id,
    category_id: starterCat1.id,
    name: "Classic Cappuccino",
    description: "Rich espresso topped with velvety steamed milk foam and cocoa dusting",
    price: 180,
    image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80",
    food_type: "veg",
    is_available: true,
    is_visible: true,
    is_bestseller: true,
    is_spicy: false,
    is_vegan: false,
    is_jain: true,
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const starterItem2: MenuItem = {
    id: `item-${Date.now()}-2`,
    restaurant_id: newRest.id,
    category_id: starterCat2.id,
    name: "Paneer Tikka Panini",
    description: "Char-grilled spiced cottage cheese with mint chutney in artisanal sourdough",
    price: 240,
    image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    food_type: "veg",
    is_available: true,
    is_visible: true,
    is_bestseller: true,
    is_spicy: true,
    is_vegan: false,
    is_jain: false,
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    restaurant: newRest,
    categories: [starterCat1, starterCat2],
    items: [starterItem1, starterItem2],
  };
}

export function MenuStoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Helper to persist state to localStorage (offline/cache)
  const persistLocalState = (
    nextRestaurants: Restaurant[],
    nextCategories: Category[],
    nextItems: MenuItem[],
    currentUser = user
  ) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_restaurants`, JSON.stringify(nextRestaurants));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_categories`, JSON.stringify(nextCategories));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_items`, JSON.stringify(nextItems));
    } catch {
      // Ignore storage quota
    }

    setAllRestaurants(nextRestaurants);
    setAllCategories(nextCategories);
    setAllItems(nextItems);

    if (currentUser) {
      // Find the most recently updated or created restaurant for this user
      const userRests = nextRestaurants.filter((r) => r.owner_id === currentUser.id);
      const userRest = userRests.length > 0 ? userRests[userRests.length - 1] : null;

      setRestaurant(userRest);
      if (userRest) {
        setCategories(
          nextCategories
            .filter((c) => c.restaurant_id === userRest.id)
            .sort((a, b) => a.position - b.position)
        );
        setItems(
          nextItems
            .filter((i) => i.restaurant_id === userRest.id)
            .sort((a, b) => a.position - b.position)
        );
      } else {
        setCategories([]);
        setItems([]);
      }
    }
  };

  // Load from Supabase or fallback to localStorage
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const supabase = getSupabaseBrowserClient();
    const cloudAvailable = isSupabaseConfigured() && Boolean(supabase);
    setIsCloudConnected(cloudAvailable);

    try {
      if (cloudAvailable && supabase) {
        // 1. Check Supabase Auth Session
        const { data: sessionData } = await supabase.auth.getSession();
        const authUser = sessionData?.session?.user;

        if (authUser) {
          // Fetch or generate Profile
          const profile: Profile = {
            id: authUser.id,
            email: authUser.email || "",
            full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Restaurant Owner",
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(profile);

          // Fetch user's restaurants from Supabase
          const { data: userRests, error: restErr } = await supabase
            .from("restaurants")
            .select("*")
            .eq("owner_id", authUser.id)
            .order("created_at", { ascending: false });

          if (restErr) {
            console.error("Failed to load restaurants from Supabase:", restErr);
          }

          if (userRests && userRests.length > 0) {
            const activeRest = userRests[0] as Restaurant;
            setRestaurant(activeRest);

            // Fetch categories for this restaurant
            const { data: catData } = await supabase
              .from("categories")
              .select("*")
              .eq("restaurant_id", activeRest.id)
              .order("position", { ascending: true });

            // Fetch items for this restaurant
            const { data: itemData } = await supabase
              .from("menu_items")
              .select("*")
              .eq("restaurant_id", activeRest.id)
              .order("position", { ascending: true });

            const validCats = (catData as Category[]) || [];
            const validItems = (itemData as MenuItem[]) || [];

            setCategories(validCats);
            setItems(validItems);
            setAllRestaurants(userRests as Restaurant[]);
            setAllCategories(validCats);
            setAllItems(validItems);
          } else {
            // User is signed in to Supabase but has no restaurant yet
            setRestaurant(null);
            setCategories([]);
            setItems([]);
          }
          return;
        }
      }

      // Offline / LocalStorage Fallback
      const isExplicitlyLoggedOut = localStorage.getItem(`${STORAGE_KEY_PREFIX}_logged_out`) === "true";
      const storedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}_current_user`);
      const storedRestaurants = localStorage.getItem(`${STORAGE_KEY_PREFIX}_restaurants`);
      const storedCategories = localStorage.getItem(`${STORAGE_KEY_PREFIX}_categories`);
      const storedItems = localStorage.getItem(`${STORAGE_KEY_PREFIX}_items`);

      const rList: Restaurant[] = storedRestaurants ? JSON.parse(storedRestaurants) : [DEMO_RESTAURANT];
      const cList: Category[] = storedCategories ? JSON.parse(storedCategories) : DEMO_CATEGORIES;
      const iList: MenuItem[] = storedItems ? JSON.parse(storedItems) : DEMO_ITEMS;

      setAllRestaurants(rList);
      setAllCategories(cList);
      setAllItems(iList);

      if (isExplicitlyLoggedOut) {
        // User explicitly logged out: do not force demo user!
        setUser(null);
        setRestaurant(null);
        setCategories([]);
        setItems([]);
      } else if (storedUser) {
        const parsedUser: Profile = JSON.parse(storedUser);
        setUser(parsedUser);

        // Find user's restaurant (pick latest)
        const userRests = rList.filter((r) => r.owner_id === parsedUser.id);
        const userRest = userRests.length > 0 ? userRests[userRests.length - 1] : null;

        setRestaurant(userRest);
        if (userRest) {
          setCategories(cList.filter((c) => c.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
          setItems(iList.filter((i) => i.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
        } else {
          setCategories([]);
          setItems([]);
        }
      } else {
        // Default to demo owner initially if never interacted
        const defaultOwner: Profile = {
          id: DEMO_OWNER_ID,
          full_name: "Aarav Sharma",
          email: "owner@cafearoma.in",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(defaultOwner);
        setRestaurant(DEMO_RESTAURANT);
        setCategories(cList.filter((c) => c.restaurant_id === DEMO_RESTAURANT_ID).sort((a, b) => a.position - b.position));
        setItems(iList.filter((i) => i.restaurant_id === DEMO_RESTAURANT_ID).sort((a, b) => a.position - b.position));
      }
    } catch (e) {
      console.error("Store initialization error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auth: Login
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_logged_out`);

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password || "password123",
        });

        if (error) {
          // If demo owner is requested and doesn't exist in Supabase auth, allow fallback demo login
          if (cleanEmail === "owner@cafearoma.in") {
            const defaultOwner: Profile = {
              id: DEMO_OWNER_ID,
              full_name: "Aarav Sharma",
              email: "owner@cafearoma.in",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUser(defaultOwner);
            setRestaurant(DEMO_RESTAURANT);
            setCategories(DEMO_CATEGORIES);
            setItems(DEMO_ITEMS);
            localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_user`, JSON.stringify(defaultOwner));
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          await refreshData();
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to sign in" };
      }
    }

    // Local / Offline fallback
    const usersStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}_registered_users`);
    const registeredUsers: Profile[] = usersStr
      ? JSON.parse(usersStr)
      : [
          {
            id: DEMO_OWNER_ID,
            full_name: "Aarav Sharma",
            email: "owner@cafearoma.in",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

    let existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail) || null;
    if (!existingUser) {
      existingUser = {
        id: `user-${Date.now()}`,
        full_name: cleanEmail.split("@")[0],
        email: cleanEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      registeredUsers.push(existingUser);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}_registered_users`, JSON.stringify(registeredUsers));
    }

    setUser(existingUser);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_user`, JSON.stringify(existingUser));

    // Find user's restaurant or create starter
    const userRests = allRestaurants.filter((r) => r.owner_id === existingUser!.id);
    const existingRest = userRests.length > 0 ? userRests[userRests.length - 1] : null;

    if (!existingRest) {
      const starter = createStarterRestaurantForUser(existingUser);
      const nextR = [...allRestaurants, starter.restaurant];
      const nextC = [...allCategories, ...starter.categories];
      const nextI = [...allItems, ...starter.items];
      persistLocalState(nextR, nextC, nextI, existingUser);
    } else {
      setRestaurant(existingRest);
      setCategories(
        allCategories
          .filter((c) => c.restaurant_id === existingRest.id)
          .sort((a, b) => a.position - b.position)
      );
      setItems(
        allItems
          .filter((i) => i.restaurant_id === existingRest.id)
          .sort((a, b) => a.position - b.position)
      );
    }

    return { success: true };
  };

  // Auth: Signup
  const signup = async (
    fullName: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_logged_out`);

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password || "password123",
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newProfile: Profile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: fullName.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(newProfile);
          setRestaurant(null);
          setCategories([]);
          setItems([]);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to create account" };
      }
    }

    // Local / Offline fallback
    const usersStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}_registered_users`);
    const registeredUsers: Profile[] = usersStr ? JSON.parse(usersStr) : [];

    const newUser: Profile = {
      id: `user-${Date.now()}`,
      full_name: fullName.trim(),
      email: cleanEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    registeredUsers.push(newUser);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_registered_users`, JSON.stringify(registeredUsers));

    setUser(newUser);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_user`, JSON.stringify(newUser));

    setRestaurant(null);
    setCategories([]);
    setItems([]);

    return { success: true };
  };

  // Auth: Logout
  const logout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Supabase signOut error:", e);
      }
    }

    setUser(null);
    setRestaurant(null);
    setCategories([]);
    setItems([]);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_logged_out`, "true");
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_current_user`);
  };

  // Quick switch account for development/demo
  const switchAccount = (email: string, fullName?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const newUser: Profile = {
      id: cleanEmail === "owner@cafearoma.in" ? DEMO_OWNER_ID : `user-${cleanEmail.replace(/[^a-z0-9]/g, "")}`,
      full_name: fullName || cleanEmail.split("@")[0],
      email: cleanEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_logged_out`);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_user`, JSON.stringify(newUser));

    const userRests = allRestaurants.filter((r) => r.owner_id === newUser.id);
    const existingRest = userRests.length > 0 ? userRests[userRests.length - 1] : null;

    if (!existingRest) {
      const starter = createStarterRestaurantForUser(newUser);
      const nextR = [...allRestaurants, starter.restaurant];
      const nextC = [...allCategories, ...starter.categories];
      const nextI = [...allItems, ...starter.items];
      persistLocalState(nextR, nextC, nextI, newUser);
    } else {
      setRestaurant(existingRest);
      setCategories(
        allCategories
          .filter((c) => c.restaurant_id === existingRest.id)
          .sort((a, b) => a.position - b.position)
      );
      setItems(
        allItems
          .filter((i) => i.restaurant_id === existingRest.id)
          .sort((a, b) => a.position - b.position)
      );
    }
  };

  // Create Restaurant (Cloud + Local)
  const createRestaurant = async (data: Partial<Restaurant>): Promise<Restaurant> => {
    if (!user) throw new Error("Must be logged in to create restaurant");

    const baseSlug = generateSlug(data.name || "my-restaurant");
    let slug = baseSlug;
    let counter = 1;
    while (allRestaurants.some((r) => r.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newRestData: Partial<Restaurant> = {
      owner_id: user.id,
      name: data.name || "My Restaurant",
      slug: data.slug ? generateSlug(data.slug) : slug,
      description: data.description || "",
      restaurant_type: data.restaurant_type || "Café",
      logo_url: data.logo_url || null,
      cover_image_url: data.cover_image_url || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      instagram: data.instagram || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || "India",
      currency: data.currency || "INR",
      template_key: data.template_key || "cafe",
      primary_color: data.primary_color || "#10B981",
      secondary_color: data.secondary_color || "#047857",
      published: data.published ?? true,
    };

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: created, error } = await supabase
          .from("restaurants")
          .insert(newRestData)
          .select()
          .single();

        if (error) throw error;
        const createdRest = created as Restaurant;
        setRestaurant(createdRest);
        setAllRestaurants((prev) => [createdRest, ...prev]);
        return createdRest;
      } catch (err) {
        console.error("Failed to insert restaurant in Supabase, falling back to local:", err);
      }
    }

    // Local fallback
    const localRest: Restaurant = {
      ...newRestData,
      id: `rest-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Restaurant;

    // Replace any previous starter restaurant for this user so no conflicts occur
    const filteredRestaurants = allRestaurants.filter((r) => r.owner_id !== user.id);
    const nextRestaurants = [...filteredRestaurants, localRest];
    persistLocalState(nextRestaurants, allCategories, allItems, user);
    setRestaurant(localRest);
    return localRest;
  };

  // Update Restaurant
  const updateRestaurant = async (updates: Partial<Restaurant>) => {
    if (!restaurant) return;

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: updated, error } = await supabase
          .from("restaurants")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", restaurant.id)
          .select()
          .single();

        if (!error && updated) {
          setRestaurant(updated as Restaurant);
          setAllRestaurants((prev) => prev.map((r) => (r.id === restaurant.id ? (updated as Restaurant) : r)));
          return;
        }
      } catch (err) {
        console.error("Supabase updateRestaurant error:", err);
      }
    }

    const updated: Restaurant = {
      ...restaurant,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const nextRestaurants = allRestaurants.map((r) => (r.id === restaurant.id ? updated : r));
    persistLocalState(nextRestaurants, allCategories, allItems);
  };

  // Publish Restaurant
  const publishRestaurant = async (): Promise<{ success: boolean; error?: string }> => {
    if (!restaurant) return { success: false, error: "No restaurant found" };
    if (!restaurant.name.trim()) return { success: false, error: "Restaurant name is required" };

    await updateRestaurant({ published: true });
    return { success: true };
  };

  // Set Template
  const setTemplate = async (template: TemplateKey) => {
    await updateRestaurant({ template_key: template });
  };

  // Add Category
  const addCategory = async (
    name: string,
    description?: string,
    targetRestaurantId?: string
  ): Promise<Category> => {
    const targetId = targetRestaurantId || restaurant?.id;
    if (!targetId) throw new Error("No restaurant active");

    const categoryData: Partial<Category> = {
      restaurant_id: targetId,
      name: name.trim(),
      description: description?.trim() || null,
      position: categories.length,
      is_visible: true,
    };

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: created, error } = await supabase
          .from("categories")
          .insert(categoryData)
          .select()
          .single();

        if (!error && created) {
          const newCat = created as Category;
          setCategories((prev) => [...prev, newCat]);
          setAllCategories((prev) => [...prev, newCat]);
          return newCat;
        }
      } catch (err) {
        console.error("Supabase addCategory error:", err);
      }
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      restaurant_id: targetId,
      name: name.trim(),
      description: description?.trim() || null,
      position: categories.length,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextCategories = [...allCategories, newCategory];
    persistLocalState(allRestaurants, nextCategories, allItems);
    return newCategory;
  };

  // Update Category
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from("categories")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id);
      } catch (err) {
        console.error("Supabase updateCategory error:", err);
      }
    }

    const nextCategories = allCategories.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    );
    persistLocalState(allRestaurants, nextCategories, allItems);
  };

  // Delete Category
  const deleteCategory = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("categories").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase deleteCategory error:", err);
      }
    }

    const nextCategories = allCategories.filter((c) => c.id !== id);
    const nextItems = allItems.filter((i) => i.category_id !== id);
    persistLocalState(allRestaurants, nextCategories, nextItems);
  };

  // Move Category
  const moveCategory = async (id: string, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((c) => c.id === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === categories.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newCategories = [...categories];
    const [moved] = newCategories.splice(currentIndex, 1);
    newCategories.splice(targetIndex, 0, moved);

    const reindexed = newCategories.map((c, idx) => ({ ...c, position: idx }));
    const nextCategories = allCategories.map((c) => {
      const match = reindexed.find((r) => r.id === c.id);
      return match || c;
    });

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      for (const cat of reindexed) {
        supabase.from("categories").update({ position: cat.position }).eq("id", cat.id);
      }
    }

    persistLocalState(allRestaurants, nextCategories, allItems);
  };

  // Add Item
  const addItem = async (
    itemData: Omit<MenuItem, "id" | "restaurant_id" | "position" | "created_at" | "updated_at">,
    targetRestaurantId?: string
  ): Promise<MenuItem> => {
    const targetId = targetRestaurantId || restaurant?.id;
    if (!targetId) throw new Error("No restaurant active");

    const categoryItems = items.filter((i) => i.category_id === itemData.category_id);
    const newItemData: Partial<MenuItem> = {
      ...itemData,
      restaurant_id: targetId,
      position: categoryItems.length,
    };

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: created, error } = await supabase
          .from("menu_items")
          .insert(newItemData)
          .select()
          .single();

        if (!error && created) {
          const newItem = created as MenuItem;
          setItems((prev) => [...prev, newItem]);
          setAllItems((prev) => [...prev, newItem]);
          return newItem;
        }
      } catch (err) {
        console.error("Supabase addItem error:", err);
      }
    }

    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      restaurant_id: targetId,
      position: categoryItems.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextItems = [...allItems, newItem];
    persistLocalState(allRestaurants, allCategories, nextItems);
    return newItem;
  };

  // Update Item
  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from("menu_items")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id);
      } catch (err) {
        console.error("Supabase updateItem error:", err);
      }
    }

    const nextItems = allItems.map((i) =>
      i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i
    );
    persistLocalState(allRestaurants, allCategories, nextItems);
  };

  // Delete Item
  const deleteItem = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from("menu_items").delete().eq("id", id);
      } catch (err) {
        console.error("Supabase deleteItem error:", err);
      }
    }

    const nextItems = allItems.filter((i) => i.id !== id);
    persistLocalState(allRestaurants, allCategories, nextItems);
  };

  // Duplicate Item
  const duplicateItem = async (id: string): Promise<MenuItem> => {
    const itemToDup = items.find((i) => i.id === id);
    if (!itemToDup) throw new Error("Item not found");

    return await addItem({
      category_id: itemToDup.category_id,
      name: `${itemToDup.name} (Copy)`,
      description: itemToDup.description,
      price: itemToDup.price,
      image_url: itemToDup.image_url,
      food_type: itemToDup.food_type,
      is_available: itemToDup.is_available,
      is_visible: itemToDup.is_visible,
      is_bestseller: itemToDup.is_bestseller,
      is_spicy: itemToDup.is_spicy,
      is_vegan: itemToDup.is_vegan,
      is_jain: itemToDup.is_jain,
    });
  };

  // Move Item
  const moveItem = async (id: string, direction: "up" | "down") => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const catItems = items.filter((i) => i.category_id === item.category_id);
    const currentIndex = catItems.findIndex((i) => i.id === id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === catItems.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newItems = [...catItems];
    const [moved] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, moved);

    const reindexed = newItems.map((i, idx) => ({ ...i, position: idx }));
    const nextItems = allItems.map((i) => {
      const match = reindexed.find((r) => r.id === i.id);
      return match || i;
    });

    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) {
      for (const it of reindexed) {
        supabase.from("menu_items").update({ position: it.position }).eq("id", it.id);
      }
    }

    persistLocalState(allRestaurants, allCategories, nextItems);
  };

  const toggleItemAvailability = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateItem(id, { is_available: !item.is_available });
  };

  const toggleItemVisibility = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateItem(id, { is_visible: !item.is_visible });
  };

  // Public retrieval (local store lookup for preview/fallback)
  const getPublicRestaurant = (slug: string): FullRestaurantData | null => {
    const cleanSlug = slug.toLowerCase().trim();
    const r = allRestaurants.find((item) => item.slug.toLowerCase() === cleanSlug);
    if (!r) {
      if (cleanSlug === DEMO_RESTAURANT.slug.toLowerCase()) {
        return {
          restaurant: DEMO_RESTAURANT,
          categories: DEMO_CATEGORIES.map((cat) => ({
            ...cat,
            items: DEMO_ITEMS.filter((i) => i.category_id === cat.id && i.is_visible).sort(
              (a, b) => a.position - b.position
            ),
          })),
        };
      }
      return null;
    }

    const restCategories = allCategories
      .filter((c) => c.restaurant_id === r.id && c.is_visible)
      .sort((a, b) => a.position - b.position)
      .map((cat) => {
        const catItems = allItems
          .filter((i) => i.category_id === cat.id && i.is_visible)
          .sort((a, b) => a.position - b.position);
        return {
          ...cat,
          items: catItems,
        };
      });

    return {
      restaurant: r,
      categories: restCategories,
    };
  };

  return (
    <MenuStoreContext.Provider
      value={{
        user,
        restaurant,
        categories,
        items,
        isLoading,
        isCloudConnected,
        login,
        signup,
        logout,
        switchAccount,
        createRestaurant,
        updateRestaurant,
        publishRestaurant,
        setTemplate,
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
        getPublicRestaurant,
        refreshData,
      }}
    >
      {children}
    </MenuStoreContext.Provider>
  );
}

export function useMenuStore() {
  const context = useContext(MenuStoreContext);
  if (!context) {
    throw new Error("useMenuStore must be used within a MenuStoreProvider");
  }
  return context;
}
