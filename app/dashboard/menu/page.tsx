"use client";

import React from "react";
import { MenuBuilderView } from "@/components/menu-builder/menu-builder-view";

export default function MenuBuilderPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            Menu Builder
          </h1>
          <p className="text-xs text-zinc-500">
            Organize categories, dishes, prices in ₹, dietary tags, and preview live.
          </p>
        </div>
      </div>
      <MenuBuilderView />
    </div>
  );
}
