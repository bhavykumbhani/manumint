import React from "react";
import type { Metadata } from "next";
import { getPublicRestaurantBySlug } from "@/lib/supabase/queries";
import { PublicMenuView } from "@/components/public-menu/public-menu-view";
import { ClientMenuFallback } from "@/components/public-menu/client-menu-fallback";
import { RestaurantMenuSchema } from "@/components/seo/structured-data";
import { getAppBaseUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicRestaurantBySlug(slug);

  if (!data) {
    return {
      title: "Digital Menu",
      description: "Scan, view, and explore chef-crafted digital menus.",
    };
  }

  const rest = data.restaurant;
  return {
    title: `${rest.name} - Digital Menu`,
    description: rest.description || `Explore the chef-crafted digital menu for ${rest.name}.`,
    openGraph: {
      title: `${rest.name} - Digital Menu`,
      description: rest.description || `Explore the chef-crafted digital menu for ${rest.name}.`,
      images: rest.cover_image_url ? [{ url: rest.cover_image_url }] : [],
    },
  };
}

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicRestaurantBySlug(slug);
  const baseUrl = getAppBaseUrl();
  const pageUrl = `${baseUrl}/menu/${slug}`;

  // If found in Supabase (or demo), render directly
  if (data) {
    const rest = data.restaurant;
    return (
      <>
        <RestaurantMenuSchema
          restaurantName={rest.name}
          description={rest.description}
          cuisine={rest.restaurant_type}
          currency={rest.currency}
          url={pageUrl}
          logo={rest.logo_url}
          address={rest.address}
        />
        <PublicMenuView data={data} />
      </>
    );
  }

  // Otherwise, allow client-side fallback (e.g. for offline local development storage)
  return <ClientMenuFallback slug={slug} />;
}
