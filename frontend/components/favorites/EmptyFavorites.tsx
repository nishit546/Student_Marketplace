import * as React from "react";
import Link from "next/link";
import { Heart, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyFavorites() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 sm:p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-500 mb-4">
        <Heart className="h-6 w-6 stroke-[1.8]" />
      </div>

      <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
        No Saved Items
      </h3>

      <p className="mt-1.5 text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
        You haven&apos;t saved any campus listings yet. Click the heart icon on any product to bookmark it for later.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/explore">
          <Button className="rounded-lg px-5 font-medium gap-2">
            <Compass className="h-4 w-4" />
            <span>Browse Marketplace</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
