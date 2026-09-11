"use client";

import React from "react";
import { DesignView } from "@/components/dashboard/design-view";

export default function DesignPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            Design & Branding
          </h1>
          <p className="text-xs text-zinc-500">
            Select an aesthetic template and customize brand accent colors with live phone preview.
          </p>
        </div>
      </div>
      <DesignView />
    </div>
  );
}
