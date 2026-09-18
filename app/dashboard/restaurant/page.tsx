"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMenuStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { Store, Globe, Phone, MessageCircle, MapPin, Sparkles, CheckCircle2, Check, Upload, Trash2 } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { RestaurantDietaryType } from "@/types";

export default function RestaurantSettingsPage() {
  const { restaurant, updateRestaurant } = useMenuStore();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [restaurantType, setRestaurantType] = useState("Café");
  const [dietaryType, setDietaryType] = useState<RestaurantDietaryType>("both");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Logo image should be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
      toast("Logo loaded from device", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast("Cover image should be under 8MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImageUrl(event.target?.result as string);
      toast("Cover image loaded from device", "success");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setSlug(restaurant.slug);
      setRestaurantType(restaurant.restaurant_type);
      setDietaryType(restaurant.dietary_type || "both");
      setDescription(restaurant.description || "");
      setLogoUrl(restaurant.logo_url || "");
      setCoverImageUrl(restaurant.cover_image_url || "");
      setPhone(restaurant.phone || "");
      setWhatsapp(restaurant.whatsapp || "");
      setInstagram(restaurant.instagram || "");
      setAddress(restaurant.address || "");
      setCity(restaurant.city || "");
      setState(restaurant.state || "");
      setCurrency(restaurant.currency || "INR");
      setPublished(restaurant.published);
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm my-8">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Restaurant Configured</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-5">Please create your restaurant profile first.</p>
        <a href="/onboarding" className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white">
          Create Restaurant
        </a>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateRestaurant({
        name: name.trim(),
        restaurant_type: restaurantType,
        dietary_type: dietaryType,
        description: description.trim() || null,
        logo_url: logoUrl.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        instagram: instagram.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        currency: currency,
        published: published,
      });
      toast("Restaurant settings saved successfully!", "success");
    } catch {
      toast("Failed to update restaurant settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            Restaurant Settings
          </h1>
          <p className="text-xs text-zinc-500">
            Update your business profile, location, contact info, and publish status.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Restaurant / Café Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Permanent URL Slug
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={slug}
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Permanent URL slug ensures printed QR codes never break.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Establishment Type
              </label>
              <select
                value={restaurantType}
                onChange={(e) => setRestaurantType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Café">Café / Coffee Shop</option>
                <option value="Restaurant">Dine-in Restaurant</option>
                <option value="Bakery">Bakery & Patisserie</option>
                <option value="Food Truck">Food Truck / Cloud Kitchen</option>
                <option value="Juice Bar">Juice & Smoothie Bar</option>
                <option value="Bar & Lounge">Bar & Lounge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Base Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="AED">AED (د.إ - UAE Dirham)</option>
              </select>
            </div>
          </div>

          {/* Dietary Kitchen Standard */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Dietary Kitchen Standard (Customer Trust & FSSAI)
                </label>
                <p className="text-[11px] text-zinc-500">
                  Controls dietary filter pills and vegetarian trust badges on your public menu.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  type: "pure_veg" as const,
                  badge: "100% Pure Veg",
                  icon: "🌱",
                  title: "Pure Veg",
                  desc: "Strictly vegetarian kitchen. Non-Veg and Egg filters are completely removed from customer view.",
                },
                {
                  type: "both" as const,
                  badge: "Dual Menu",
                  icon: "🥗🍗",
                  title: "Veg & Non-Veg (Mix)",
                  desc: "Serves both vegetarian and non-vegetarian dishes. All dietary filter pills are shown.",
                },
                {
                  type: "non_veg" as const,
                  badge: "Specialty",
                  icon: "🍗",
                  title: "Non-Veg Specialty",
                  desc: "Specializes in non-vegetarian cuisine, grills, meat, and seafood.",
                },
              ].map((opt) => {
                const isSelected = dietaryType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setDietaryType(opt.type)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500 shadow-xs scale-[1.01]"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{opt.icon}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                        {opt.title}
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug mt-1">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>


          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Short Description / Tagline
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Artisanal coffee, handcrafted teas, and freshly toasted treats..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Media / Visual Assets */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Media & Images
          </h2>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={logoInputRef}
            accept="image/*"
            onChange={handleLogoFileChange}
            className="hidden"
          />
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            onChange={handleCoverFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Logo Image */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Restaurant Logo
              </label>

              {logoUrl ? (
                <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white dark:bg-zinc-750 shrink-0 border border-zinc-300 dark:border-zinc-600">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">Logo Active</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline"
                      >
                        Change File
                      </button>
                      <span className="text-zinc-300 dark:text-zinc-600">•</span>
                      <button
                        type="button"
                        onClick={() => setLogoUrl("")}
                        className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full px-3 py-2.5 rounded-xl border border-dashed border-emerald-500/70 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100/50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo from Device
                  </button>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="or paste logo URL: https://..."
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Cover Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Cover Photo
              </label>

              {coverImageUrl ? (
                <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 shrink-0 border border-zinc-300 dark:border-zinc-600">
                    <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">Cover Photo Active</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline"
                      >
                        Change File
                      </button>
                      <span className="text-zinc-300 dark:text-zinc-600">•</span>
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full px-3 py-2.5 rounded-xl border border-dashed border-emerald-500/70 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100/50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Cover Photo
                  </button>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="or paste cover URL: https://..."
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            Contact & Social
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                WhatsApp (+CountryCode)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="cafearoma.official"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop 14, Ground Floor, Indiranagar 100ft Road"
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Karnataka"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Publish Status Toggle */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Publish Menu to Web</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              When live, customers scanning your QR code can see your full active menu.
            </p>
          </div>
          <Switch checked={published} onChange={setPublished} />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
