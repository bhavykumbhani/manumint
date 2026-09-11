import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  restaurantType: z.string().min(1, "Restaurant type is required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().default("INR"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  isVisible: z.boolean().default(true),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  foodType: z.enum(["veg", "non_veg", "egg"]).default("veg"),
  isAvailable: z.boolean().default(true),
  isVisible: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isJain: z.boolean().default(false),
});
