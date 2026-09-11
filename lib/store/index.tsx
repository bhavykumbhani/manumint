"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Category, FullRestaurantData, MenuItem, Profile, Restaurant, TemplateKey } from "@/types";
import { DEMO_CATEGORIES, DEMO_ITEMS, DEMO_OWNER_ID, DEMO_RESTAURANT, DEMO_RESTAURANT_ID } from "@/lib/demo-data";
import { generateSlug } from "@/lib/utils";

interface MenuStoreContextType {
  user: Profile | null;
  restaurant: Restaurant | null;
  categories: Category[];
  items: MenuItem[];
  isLoading: boolean;
  
  // Auth methods
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchAccount: (email: string, fullName?: string) => void;

  // Restaurant methods
  createRestaurant: (data: Partial<Restaurant>) => Promise<Restaurant>;
  updateRestaurant: (updates: Partial<Restaurant>) => Promise<void>;
  publishRestaurant: () => Promise<{ success: boolean; error?: string }>;
  setTemplate: (template: TemplateKey) => Promise<void>;
  
  // Category methods
  addCategory: (name: string, description?: string) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  moveCategory: (id: string, direction: "up" | "down") => Promise<void>;

  // Item methods
  addItem: (item: Omit<MenuItem, "id" | "restaurant_id" | "position" | "created_at" | "updated_at">) => Promise<MenuItem>;
  updateItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  duplicateItem: (id: string) => Promise<MenuItem>;
  moveItem: (id: string, direction: "up" | "down") => Promise<void>;
  toggleItemAvailability: (id: string) => Promise<void>;
  toggleItemVisibility: (id: string) => Promise<void>;

  // Public retrieval
  getPublicRestaurant: (slug: string) => FullRestaurantData | null;
}

const STORAGE_KEY_PREFIX = "menumint_v1";

const MenuStoreContext = createContext<MenuStoreContextType | undefined>(undefined);

export function MenuStoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage or initialize seed
  useEffect(() => {
    try {
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

      if (storedUser) {
        const parsedUser: Profile = JSON.parse(storedUser);
        setUser(parsedUser);
        const userRest = rList.find((r) => r.owner_id === parsedUser.id) || null;
        setRestaurant(userRest);
        if (userRest) {
          setCategories(cList.filter((c) => c.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
          setItems(iList.filter((i) => i.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
        } else {
          setCategories([]);
          setItems([]);
        }
      } else {
        // Default to demo owner initially
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
        localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_user`, JSON.stringify(defaultOwner));
      }
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage helper
  const persistState = (
    nextRestaurants: Restaurant[],
    nextCategories: Category[],
    nextItems: MenuItem[],
    currentUser = user
  ) => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_restaurants`, JSON.stringify(nextRestaurants));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_categories`, JSON.stringify(nextCategories));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_items`, JSON.stringify(nextItems));

    setAllRestaurants(nextRestaurants);
    setAllCategories(nextCategories);
    setAllItems(nextItems);

    if (currentUser) {
      const userRest = nextRestaurants.find((r) => r.owner_id === currentUser.id) || null;
      setRestaurant(userRest);
      if (userRest) {
        setCategories(nextCategories.filter((c) => c.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
        setItems(nextItems.filter((i) => i.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
      } else {
        setCategories([]);
        setItems([]);
      }
    }
  };

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    let existingUser: Profile | null = null;
    const usersStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}_registered_users`);
    const registeredUsers: Profile[] = usersStr ? JSON.parse(usersStr) : [
      {
        id: DEMO_OWNER_ID,
        full_name: "Aarav Sharma",
        email: "owner@cafearoma.in",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

    existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail) || null;

    if (!existingUser) {
      // Auto-register convenience for seamless testing
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

    // Load their restaurant
    const userRest = allRestaurants.find((r) => r.owner_id === existingUser!.id) || null;
    setRestaurant(userRest);
    if (userRest) {
      setCategories(allCategories.filter((c) => c.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
      setItems(allItems.filter((i) => i.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
    } else {
      setCategories([]);
      setItems([]);
    }

    return { success: true };
  };

  const signup = async (fullName: string, email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const usersStr = localStorage.getItem(`${STORAGE_KEY_PREFIX}_registered_users`);
    const registeredUsers: Profile[] = usersStr ? JSON.parse(usersStr) : [
      {
        id: DEMO_OWNER_ID,
        full_name: "Aarav Sharma",
        email: "owner@cafearoma.in",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

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

  const logout = () => {
    setUser(null);
    setRestaurant(null);
    setCategories([]);
    setItems([]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}_current_user`);
  };

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
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_current_user`, JSON.stringify(newUser));

    const userRest = allRestaurants.find((r) => r.owner_id === newUser.id) || null;
    setRestaurant(userRest);
    if (userRest) {
      setCategories(allCategories.filter((c) => c.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
      setItems(allItems.filter((i) => i.restaurant_id === userRest.id).sort((a, b) => a.position - b.position));
    } else {
      setCategories([]);
      setItems([]);
    }
  };

  const createRestaurant = async (data: Partial<Restaurant>): Promise<Restaurant> => {
    if (!user) throw new Error("Must be logged in to create restaurant");

    const baseSlug = generateSlug(data.name || "my-restaurant");
    let slug = baseSlug;
    let counter = 1;
    while (allRestaurants.some((r) => r.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
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
      published: data.published ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextRestaurants = [...allRestaurants, newRest];
    persistState(nextRestaurants, allCategories, allItems);
    return newRest;
  };

  const updateRestaurant = async (updates: Partial<Restaurant>) => {
    if (!restaurant) return;
    const updated: Restaurant = {
      ...restaurant,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const nextRestaurants = allRestaurants.map((r) => (r.id === restaurant.id ? updated : r));
    persistState(nextRestaurants, allCategories, allItems);
  };

  const publishRestaurant = async (): Promise<{ success: boolean; error?: string }> => {
    if (!restaurant) return { success: false, error: "No restaurant found" };
    if (!restaurant.name.trim()) return { success: false, error: "Restaurant name is required" };
    if (categories.length === 0) return { success: false, error: "Please create at least one category before publishing" };
    
    const visibleItems = items.filter((i) => i.is_visible);
    if (visibleItems.length === 0) {
      return { success: false, error: "Please add at least one visible menu item before publishing" };
    }

    await updateRestaurant({ published: true });
    return { success: true };
  };

  const setTemplate = async (template: TemplateKey) => {
    await updateRestaurant({ template_key: template });
  };

  const addCategory = async (name: string, description?: string): Promise<Category> => {
    if (!restaurant) throw new Error("No restaurant active");

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      restaurant_id: restaurant.id,
      name: name.trim(),
      description: description?.trim() || null,
      position: categories.length,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextCategories = [...allCategories, newCategory];
    persistState(allRestaurants, nextCategories, allItems);
    return newCategory;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const nextCategories = allCategories.map((c) =>
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    );
    persistState(allRestaurants, nextCategories, allItems);
  };

  const deleteCategory = async (id: string) => {
    const nextCategories = allCategories.filter((c) => c.id !== id);
    const nextItems = allItems.filter((i) => i.category_id !== id);
    persistState(allRestaurants, nextCategories, nextItems);
  };

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

    persistState(allRestaurants, nextCategories, allItems);
  };

  const addItem = async (
    itemData: Omit<MenuItem, "id" | "restaurant_id" | "position" | "created_at" | "updated_at">
  ): Promise<MenuItem> => {
    if (!restaurant) throw new Error("No restaurant active");

    const categoryItems = items.filter((i) => i.category_id === itemData.category_id);
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      restaurant_id: restaurant.id,
      position: categoryItems.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextItems = [...allItems, newItem];
    persistState(allRestaurants, allCategories, nextItems);
    return newItem;
  };

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    const nextItems = allItems.map((i) =>
      i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i
    );
    persistState(allRestaurants, allCategories, nextItems);
  };

  const deleteItem = async (id: string) => {
    const nextItems = allItems.filter((i) => i.id !== id);
    persistState(allRestaurants, allCategories, nextItems);
  };

  const duplicateItem = async (id: string): Promise<MenuItem> => {
    const itemToDup = items.find((i) => i.id === id);
    if (!itemToDup) throw new Error("Item not found");

    const duplicated: MenuItem = {
      ...itemToDup,
      id: `item-${Date.now()}`,
      name: `${itemToDup.name} (Copy)`,
      position: items.filter((i) => i.category_id === itemToDup.category_id).length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nextItems = [...allItems, duplicated];
    persistState(allRestaurants, allCategories, nextItems);
    return duplicated;
  };

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

    persistState(allRestaurants, allCategories, nextItems);
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

  const getPublicRestaurant = (slug: string): FullRestaurantData | null => {
    const r = allRestaurants.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
    if (!r) return null;

    // Filter categories for this restaurant
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
