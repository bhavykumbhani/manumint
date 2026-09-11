import { Category, MenuItem, Restaurant } from "@/types";

export interface TemplateProps {
  restaurant: Restaurant;
  categories: (Category & { items: MenuItem[] })[];
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
  searchQuery?: string;
  selectedFilter?: "all" | "veg" | "non_veg" | "egg" | "jain" | "vegan";
  isSimulatedPreview?: boolean;
  onItemClick?: (item: MenuItem) => void;
}
