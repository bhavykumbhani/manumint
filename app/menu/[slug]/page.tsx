"use client";

import React, { use } from "react";
import { useMenuStore } from "@/lib/store";
import { PublicMenuView } from "@/components/public-menu/public-menu-view";
import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { getPublicRestaurant, isLoading } = useMenuStore();

  const data = getPublicRestaurant(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-zinc-500">Opening menu...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Restaurant Menu Not Found</h1>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
          The menu for <span className="font-mono text-zinc-700 dark:text-zinc-300">"{slug}"</span> doesn't exist or is currently unpublished.
        </p>
        <Link href="/">
          <Button variant="primary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Go to MenuMint
          </Button>
        </Link>
      </div>
    );
  }

  return <PublicMenuView data={data} />;
}
