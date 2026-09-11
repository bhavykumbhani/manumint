import { TemplateKey } from "@/types";
import { MinimalTemplate } from "./minimal-template";
import { CafeTemplate } from "./cafe-template";
import { ModernDarkTemplate } from "./modern-dark-template";
import { ElegantTemplate } from "./elegant-template";
import { TemplateProps } from "./types";

export const MENU_TEMPLATES: Record<TemplateKey, React.ComponentType<TemplateProps>> = {
  minimal: MinimalTemplate,
  cafe: CafeTemplate,
  modern_dark: ModernDarkTemplate,
  elegant: ElegantTemplate,
};

export interface TemplateMeta {
  key: TemplateKey;
  name: string;
  description: string;
  badge: string;
  accentBg: string;
}

export const TEMPLATE_METAS: TemplateMeta[] = [
  {
    key: "cafe",
    name: "Artisanal Café",
    description: "Warm amber & cream tones with prominent food cards and friendly rounded badges.",
    badge: "Most Popular",
    accentBg: "bg-amber-50 border-amber-200 text-amber-900",
  },
  {
    key: "minimal",
    name: "Clean Minimalist",
    description: "Crisp white background, high contrast typography, and structured editorial dividers.",
    badge: "Modern Clean",
    accentBg: "bg-white border-zinc-200 text-zinc-900",
  },
  {
    key: "modern_dark",
    name: "Modern Dark",
    description: "Deep charcoal palette with glowing emerald accents for lounges and night bistros.",
    badge: "Night & Lounge",
    accentBg: "bg-zinc-950 border-zinc-800 text-white",
  },
  {
    key: "elegant",
    name: "Fine Dining",
    description: "Serif typography, gold filigree accents, and dot-leader spacing for upscale restaurants.",
    badge: "Fine Dining",
    accentBg: "bg-[#121417] border-[#2C2F36] text-amber-100",
  },
];
