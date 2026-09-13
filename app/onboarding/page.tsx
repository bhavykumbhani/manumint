"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/lib/store";
import { FoodType, TemplateKey } from "@/types";
import { TEMPLATE_METAS } from "@/components/menu-templates";
import { FoodIndicator } from "@/components/ui/food-indicator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getAppBaseUrl } from "@/lib/utils";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import Link from "next/link";
import {
  Store,
  Palette,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Check,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, restaurant, createRestaurant, setTemplate, addCategory, addItem, publishRestaurant } = useMenuStore();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Restaurant Info
  const [restName, setRestName] = useState("Cafe Aroma");
  const [restType, setRestType] = useState("Café");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [whatsapp, setWhatsapp] = useState("+919876543210");
  const [address, setAddress] = useState("Shop 14, Ground Floor, Indiranagar");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80");

  // Step 2: Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("cafe");

  // Step 3: First Category & Item
  const [categoryName, setCategoryName] = useState("Hot Beverages");
  const [itemName, setItemName] = useState("Masala Chai");
  const [itemPrice, setItemPrice] = useState("30");
  const [foodType, setFoodType] = useState<FoodType>("veg");

  // Step 4: Live Celebration
  const [createdSlug, setCreatedSlug] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Step 1 -> Step 2
  const handleNextFromStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName.trim()) {
      toast("Please enter your restaurant name", "error");
      return;
    }
    setStep(2);
  };

  // Step 2 -> Step 3
  const handleNextFromStep2 = () => {
    setStep(3);
  };

  // Step 3 -> Step 4 (Create, Add Category, Add Item, Publish!)
  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || !categoryName.trim()) {
      toast("Please complete all required item fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Create Restaurant
      const newRest = await createRestaurant({
        name: restName.trim(),
        restaurant_type: restType,
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        logo_url: logoUrl.trim() || null,
        template_key: selectedTemplate,
        published: true,
      });

      // 2. Add Category explicitly linked to this new restaurant
      const newCat = await addCategory(categoryName.trim(), undefined, newRest.id);

      // 3. Add Item explicitly linked to this new restaurant
      await addItem(
        {
          category_id: newCat.id,
          name: itemName.trim(),
          price: parseFloat(itemPrice) || 30,
          food_type: foodType,
          description: "Freshly prepared classic with authentic spices",
          image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
          is_available: true,
          is_visible: true,
          is_bestseller: true,
          is_spicy: false,
          is_vegan: false,
          is_jain: true,
        },
        newRest.id
      );

      // 4. Set celebration state
      const targetSlug = newRest.slug;
      setCreatedSlug(targetSlug);
      const publicUrl = `${getAppBaseUrl()}/menu/${targetSlug}`;
      const qrUrl = await QRCode.toDataURL(publicUrl, { width: 512, margin: 2 });
      setQrCodeDataUrl(qrUrl);

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setStep(4);
    } catch (err: any) {
      toast(err.message || "Failed to create menu", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUrl = () => {
    const url = `${getAppBaseUrl()}/menu/${createdSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Menu link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    const a = document.createElement("a");
    a.href = qrCodeDataUrl;
    a.download = `${createdSlug}-qr.png`;
    a.click();
    toast("Downloaded QR Code!", "success");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4 flex flex-col justify-center items-center">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <span className="text-2xl font-black tracking-tight text-emerald-600">MenuMint</span>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          Restaurant Setup Wizard
        </h1>
        <p className="text-xs text-zinc-500">Create your digital menu and QR in 2 minutes</p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="w-full max-w-xl mb-8 flex items-center justify-between relative px-2">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 -z-0" />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-emerald-600 transition-all duration-300 -z-0"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
        {[
          { num: 1, label: "Profile", icon: Store },
          { num: 2, label: "Style", icon: Palette },
          { num: 3, label: "First Dish", icon: UtensilsCrossed },
          { num: 4, label: "Live", icon: Sparkles },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= s.num
                  ? "bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              <s.icon className="w-4 h-4" />
            </div>
            <span
              className={`text-[11px] font-semibold mt-1.5 ${
                step >= s.num ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Containers */}
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {/* STEP 1: Restaurant Info */}
        {step === 1 && (
          <form onSubmit={handleNextFromStep1} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Step 1: Restaurant Details</h2>
              <p className="text-xs text-zinc-500">Provide basic info so customers can recognize your venue.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  placeholder="e.g. Cafe Aroma"
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Business Type *
                </label>
                <select
                  value={restType}
                  onChange={(e) => setRestType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Café">Café / Coffee Shop</option>
                  <option value="Restaurant">Dine-in Restaurant</option>
                  <option value="Bakery">Bakery & Patisserie</option>
                  <option value="Food Truck">Food Truck / Cloud Kitchen</option>
                  <option value="Juice Bar">Juice & Smoothie Bar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  WhatsApp Contact
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+919876543210"
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
                placeholder="Shop 14, Indiranagar 100ft Road"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="lg">
                Continue to Style
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Choose Template */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Step 2: Choose Menu Style</h2>
              <p className="text-xs text-zinc-500">Select an aesthetic that fits your establishment. You can switch anytime.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {TEMPLATE_METAS.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.key;
                return (
                  <div
                    key={tmpl.key}
                    onClick={() => setSelectedTemplate(tmpl.key)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{tmpl.badge}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{tmpl.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{tmpl.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button type="button" variant="primary" size="lg" onClick={handleNextFromStep2}>
                Next: Add First Dish
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Add First Category & Item */}
        {step === 3 && (
          <form onSubmit={handleCompleteOnboarding} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Step 3: Add First Category & Dish</h2>
              <p className="text-xs text-zinc-500">Every live menu needs at least one category and one signature dish.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Hot Beverages"
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Dish / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Masala Chai"
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="30"
                    className="w-full pl-8 pr-3 py-2.5 text-sm font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Food Classification (FSSAI)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { type: "veg", label: "Veg" },
                    { type: "non_veg", label: "Non-Veg" },
                    { type: "egg", label: "Egg" },
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.type}
                    onClick={() => setFoodType(opt.type)}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      foodType === opt.type
                        ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 ring-1 ring-emerald-500"
                        : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <FoodIndicator type={opt.type} size="sm" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
                Publish Menu Now 🚀
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4: Live Celebration */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                Your menu is live 🎉
              </h2>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Congratulations! Your digital menu for <strong>{restName}</strong> is now published and accessible to anyone via this QR code.
              </p>
            </div>

            {/* QR Card Container */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/60 rounded-3xl border border-zinc-200 dark:border-zinc-700 max-w-xs mx-auto flex flex-col items-center">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Menu QR Code"
                  className="w-48 h-48 rounded-2xl bg-white p-2 shadow-md border border-zinc-200 mb-3"
                />
              ) : (
                <div className="w-48 h-48 bg-zinc-200 animate-pulse rounded-2xl mb-3" />
              )}
              <span className="text-xs font-mono text-zinc-500 truncate max-w-full">
                /menu/{createdSlug}
              </span>
            </div>

            {/* Quick Link Bar */}
            <div className="flex items-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                readOnly
                value={`${getAppBaseUrl()}/menu/${createdSlug}`}
                className="flex-1 px-3 py-2 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
              />
              <Button variant="outline" size="sm" onClick={copyUrl}>
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`${getAppBaseUrl()}/menu/${createdSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" size="md" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Preview Menu
                </Button>
              </a>
              <Button variant="primary" size="md" onClick={downloadQr} className="w-full">
                <Download className="w-4 h-4 mr-1.5" />
                Download QR
              </Button>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Link href="/dashboard">
                <Button variant="secondary" className="w-full">
                  Go to Restaurant Dashboard
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
