import * as React from "react";
import Link from "next/link";
import { Heart, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyFavorites() {
  return (
    <div className="rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-5">
        <Heart className="h-8 w-8 stroke-[1.8]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
        No Saved Items Yet
      </h3>

      <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
        You haven&apos;t added any campus listings to your wishlist. Tap the heart
        icon on any product to save it here for quick access when you are ready to buy.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/explore">
          <Button className="rounded-xl px-6 font-bold gap-2 shadow-sm hover:shadow">
            <Compass className="h-4 w-4" />
            <span>Explore Campus Marketplace</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

