import React from "react";
import { getAppBaseUrl } from "@/lib/utils";

export function OrganizationSchema() {
  const baseUrl = getAppBaseUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ManuMaker",
    alternateName: ["Manu Maker", "ManuMaker QR Menu"],
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description:
      "ManuMaker is an all-in-one digital menu and QR code generator for restaurants, cafés, cloud kitchens, and food trucks. Create contactless menus in under 2 minutes with live INR (₹) pricing and FSSAI tags.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      category: "Free Tier Available",
    },
    author: {
      "@type": "Organization",
      name: "ManuMaker",
      url: baseUrl,
      logo: `${baseUrl}/icon.svg`,
    },
    featureList: [
      "Instant QR Code Generation for Dining Tables",
      "Dynamic Menu Builder with Categories & Modifiers",
      "Official FSSAI Veg, Non-Veg, Egg & Jain Food Indicators",
      "Designer Templates (Artisanal Café, Clean Minimalist, Modern Dark, Fine Dining)",
      "Zero App Download Required for Diners",
      "Real-Time Price & Item Availability Toggling",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PricingSchema() {
  const baseUrl = getAppBaseUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ManuMaker Restaurant Digital Menu SaaS",
    image: `${baseUrl}/icon.svg`,
    description:
      "Subscription plans for ManuMaker digital QR restaurant menu management.",
    brand: {
      "@type": "Brand",
      name: "ManuMaker",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Starter Free Plan",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/pricing`,
      },
      {
        "@type": "Offer",
        name: "Pro Restaurant Plan",
        price: "499",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "499",
          priceCurrency: "INR",
          unitCode: "MON",
        },
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/pricing`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function RestaurantMenuSchema({
  restaurantName,
  description,
  cuisine,
  currency = "INR",
  url,
  logo,
  address,
}: {
  restaurantName: string;
  description?: string | null;
  cuisine?: string;
  currency?: string;
  url: string;
  logo?: string | null;
  address?: string | null;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurantName,
    description: description || `Digital menu for ${restaurantName}`,
    servesCuisine: cuisine || "Multi-Cuisine",
    currenciesAccepted: currency,
    url,
    ...(logo ? { image: logo } : {}),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address,
          },
        }
      : {}),
    hasMenu: {
      "@type": "Menu",
      name: `${restaurantName} Digital Menu`,
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
