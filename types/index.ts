export type FoodType = 'veg' | 'non_veg' | 'egg';
export type RestaurantDietaryType = 'pure_veg' | 'non_veg' | 'both';

export type TemplateKey =
  | 'minimal'
  | 'cafe'
  | 'modern_dark'
  | 'elegant'
  | 'street_bites'
  | 'royal_heritage'
  | 'retro_diner'
  | 'neon_lounge'
  | 'botanical_garden';

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
  owner_email?: string | null;
  name: string;
  slug: string;
  description: string | null;
  restaurant_type: string;
  dietary_type?: RestaurantDietaryType;
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

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'pending';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  order_number: number;
  table_number: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export type ServiceRequestType = 'waiter' | 'water' | 'bill' | 'cleaning' | 'other';
export type ServiceRequestStatus = 'pending' | 'attended';

export interface ServiceRequest {
  id: string;
  restaurant_id: string;
  table_number: string;
  request_type: ServiceRequestType;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at?: string;
}

