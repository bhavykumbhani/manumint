export type FoodType = 'veg' | 'non_veg' | 'egg';

export type TemplateKey = 'minimal' | 'cafe' | 'modern_dark' | 'elegant';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  restaurant_type: string;
  logo_url: string | null;
  cover_image_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  currency: string;
  template_key: TemplateKey;
  primary_color: string;
  secondary_color: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  food_type: FoodType;
  is_available: boolean;
  is_visible: boolean;
  is_bestseller: boolean;
  is_spicy: boolean;
  is_vegan: boolean;
  is_jain: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface MenuView {
  id: string;
  restaurant_id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface FullRestaurantData {
  restaurant: Restaurant;
  categories: (Category & { items: MenuItem[] })[];
}
