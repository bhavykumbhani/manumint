import { TemplateKey } from "@/types";
import { MinimalTemplate } from "./minimal-template";
import { CafeTemplate } from "./cafe-template";
import { ModernDarkTemplate } from "./modern-dark-template";
import { ElegantTemplate } from "./elegant-template";
import { StreetBitesTemplate } from "./street-bites-template";
import { RoyalHeritageTemplate } from "./royal-heritage-template";
import { RetroDinerTemplate } from "./retro-diner-template";
import { NeonLoungeTemplate } from "./neon-lounge-template";
import { BotanicalGardenTemplate } from "./botanical-garden-template";
import { TemplateProps } from "./types";

export const MENU_TEMPLATES: Record<TemplateKey, React.ComponentType<TemplateProps>> = {
  cafe: CafeTemplate,
  minimal: MinimalTemplate,
  modern_dark: ModernDarkTemplate,
  elegant: ElegantTemplate,
  street_bites: StreetBitesTemplate,
  royal_heritage: RoyalHeritageTemplate,
  retro_diner: RetroDinerTemplate,
  neon_lounge: NeonLoungeTemplate,
  botanical_garden: BotanicalGardenTemplate,
};

export interface TemplateMeta {
  key: TemplateKey;
  name: string;
  description: string;
  badge: string;
  accentBg: string;
  previewImage: string;
  previewGradient: string;
  vibe: string;
}

export const TEMPLATE_METAS: TemplateMeta[] = [
  {
    key: "cafe",
    name: "Artisanal Café",
    description: "Warm amber & cream tones with prominent food cards and friendly rounded badges.",
    badge: "Most Popular",
    accentBg: "bg-amber-50 border-amber-200 text-amber-900",
    previewImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-amber-600 via-orange-600 to-amber-900",
    vibe: "Warm Amber & Bakery",
  },
  {
    key: "minimal",
    name: "Clean Minimalist",
    description: "Crisp white background, high contrast typography, and structured editorial dividers.",
    badge: "Modern Clean",
    accentBg: "bg-white border-zinc-200 text-zinc-900",
    previewImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-zinc-700 via-zinc-800 to-zinc-950",
    vibe: "Crisp White & Minimal",
  },
  {
    key: "modern_dark",
    name: "Modern Dark",
    description: "Deep charcoal palette with glowing emerald accents for lounges and night bistros.",
    badge: "Night & Lounge",
    accentBg: "bg-zinc-950 border-zinc-800 text-white",
    previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-zinc-900 via-emerald-950 to-black",
    vibe: "Dark Charcoal & Emerald",
  },
  {
    key: "elegant",
    name: "Fine Dining",
    description: "Serif typography, gold filigree accents, and dot-leader spacing for upscale restaurants.",
    badge: "Fine Dining",
    accentBg: "bg-[#121417] border-[#2C2F36] text-amber-100",
    previewImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-stone-900 via-amber-950 to-black",
    vibe: "Luxury Gold & Serif",
  },
  {
    key: "street_bites",
    name: "Street Food & QSR",
    description: "Vibrant saffron & fiery orange gradients with high-energy cards for quick bites and fast casual.",
    badge: "Fast & Punchy",
    accentBg: "bg-orange-50 border-orange-200 text-orange-950",
    previewImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-orange-600 via-amber-500 to-red-600",
    vibe: "Fiery Saffron & Street",
  },
  {
    key: "royal_heritage",
    name: "Royal Heritage",
    description: "Regal burgundy and antique gold filigree with palace motifs for authentic royal cuisines.",
    badge: "Royal Palace",
    accentBg: "bg-[#2D0F16] border-[#D4AF37]/40 text-[#FDF8F0]",
    previewImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-rose-950 via-purple-950 to-amber-900",
    vibe: "Regal Maroon & Gold",
  },
  {
    key: "retro_diner",
    name: "Retro Diner & Pizzeria",
    description: "Vintage 1950s Americana diner, cherry red and custard tones with classic checkered accents.",
    badge: "Retro & Pizzeria",
    accentBg: "bg-red-50 border-red-200 text-red-950",
    previewImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-red-600 via-rose-600 to-amber-700",
    vibe: "Cherry Red & Checkered",
  },
  {
    key: "neon_lounge",
    name: "Neon Cyber Lounge",
    description: "Pitch-black OLED with electric cyan & neon pink glow for rooftop bars, nightclubs, and pubs.",
    badge: "Club & Bar",
    accentBg: "bg-zinc-950 border-cyan-500/40 text-cyan-300",
    previewImage: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-cyan-950 via-purple-950 to-black",
    vibe: "Electric Cyan & Neon",
  },
  {
    key: "botanical_garden",
    name: "Botanical & Organic",
    description: "Earthy sage green and soft natural ivory for salad bars, healthy bowl cafes, and organic kitchens.",
    badge: "Garden & Fresh",
    accentBg: "bg-emerald-50 border-emerald-200 text-emerald-950",
    previewImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    previewGradient: "from-emerald-800 via-teal-800 to-green-950",
    vibe: "Lush Sage & Nature",
  },
];
