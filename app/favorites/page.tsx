"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ArrowRight, Sparkles, Tag, ShieldCheck } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useProducts } from "@/context/ProductsContext";
import { EmptyFavorites } from "@/components/favorites/EmptyFavorites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function FavoritesPage() {
  const { favoriteIds, favoriteProducts, removeFavorite, isLoading, refreshFavorites } =
    useFavorites();
  const { products: allContextProducts } = useProducts();
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  // Combine products from API favorites with any loaded in ProductsContext
  const displayedFavorites = React.useMemo(() => {
    const map = new Map<string, Product>();

    // Add from favorites endpoint
    favoriteProducts.forEach((p) => {
      const pId = p.id || p._id || "";
      if (pId) map.set(pId, p);
    });

    // If an ID is favorited, ensure it's loaded from allContextProducts if not in map
    favoriteIds.forEach((id) => {
      if (!map.has(id)) {
        const found = allContextProducts.find((p) => (p.id === id || p._id === id));
        if (found) map.set(id, found);
      }
    });

    return Array.from(map.values()).filter((p) =>
      favoriteIds.includes(p.id || p._id || "")
    );
  }, [favoriteProducts, favoriteIds, allContextProducts]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    await removeFavorite(productId);
    setRemovingId(null);
  };

  if (isLoading && favoriteIds.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 mb-8 animate-pulse">
            <div className="h-4 w-28 bg-neutral-200 rounded-full" />
            <div className="h-8 w-64 bg-neutral-200 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-white border border-neutral-200/60 p-4 animate-pulse flex flex-col justify-between"
              >
                <div className="h-40 bg-neutral-100 rounded-xl" />
                <div className="space-y-2 mt-3">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-600 border border-rose-200/60 mb-2">
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Personal Wishlist</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Saved Favorites
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Campus listings you&apos;ve bookmarked to keep track of, compare, or buy later.
            </p>
          </div>

          {displayedFavorites.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 shadow-xs">
                {displayedFavorites.length} {displayedFavorites.length === 1 ? "Item" : "Items"} Saved
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshFavorites()}
                className="rounded-xl text-xs font-medium"
              >
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {displayedFavorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedFavorites.map((product) => {
              const productId = product.id || product._id || "";
              const isRemoving = removingId === productId;
              const isSold = product.status === "Sold";

              return (
                <div
                  key={productId}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
                >
                  <Link href={`/product/${productId}`} className="flex flex-col flex-1">
                    {/* Image */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          isSold ? "grayscale opacity-60" : ""
                        }`}
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                          {product.listingType === "Free" ? (
                            <Badge variant="free">FREE</Badge>
                          ) : product.listingType === "Exchange" ? (
                            <Badge variant="exchange">EXCHANGE</Badge>
                          ) : null}
                          {isSold && <Badge variant="sold">SOLD</Badge>}
                        </div>

                        {/* Remove from favorites button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemove(productId);
                          }}
                          disabled={isRemoving}
                          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 backdrop-blur-md shadow-sm transition-all hover:bg-rose-500 hover:text-white"
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-semibold text-neutral-500 truncate">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                          {product.condition}
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-sm font-bold text-neutral-900 group-hover:text-[#ff4000] transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-neutral-100">
                        <span className="text-base font-black text-neutral-900">
                          {formatPrice(product.price, product.listingType)}
                        </span>
                        <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          <span>{product.seller?.college || "Campus"}</span>
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Bottom Action Footer */}
                  <div className="p-3 pt-0 flex gap-2">
                    <Link
                      href={`/product/${productId}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold rounded-xl justify-center gap-1 text-neutral-800 hover:text-[#ff4000] hover:border-[#ff4000]"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

