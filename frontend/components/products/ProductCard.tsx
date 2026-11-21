"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, ArrowRight, User } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";

interface ProductCardProps {
  product: Product;
  isSaved?: boolean;
  onToggleSave?: (productId: string) => void;
}

export function ProductCard({
  product,
  onToggleSave,
}: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const productId = product.id || product._id || "";
  const saved = isFavorite(productId);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(productId);
    if (onToggleSave) {
      onToggleSave(productId);
    }
  };

  const isSold = product.status === "Sold";
  const isReserved = product.status === "Reserved";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg">
      <Link href={`/product/${productId}`} className="flex flex-col h-full">
        {/* Product Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
          <Image
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
            }
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isSold ? "grayscale opacity-60" : ""
            } ${imageLoaded ? "opacity-100" : "opacity-90"}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex flex-wrap gap-1.5 pointer-events-auto">
              {product.listingType === "Free" ? (
                <Badge variant="free">FREE GIVEAWAY</Badge>
              ) : product.listingType === "Exchange" ? (
                <Badge variant="exchange">FOR EXCHANGE</Badge>
              ) : null}

              {product.featured && (
                <Badge variant="brandSolid" className="text-[10px] uppercase tracking-wide">
                  Featured
                </Badge>
              )}
            </div>

            {/* Favorite / Bookmark Button */}
            <button
              onClick={handleHeartClick}
              type="button"
              className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-sm ${
                saved
                  ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
                  : "bg-white/90 text-neutral-700 hover:bg-white hover:text-rose-500"
              }`}
              title={saved ? "Remove from saved" : "Save for later"}
              aria-label="Save product"
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Sold / Reserved Overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="rounded-lg bg-neutral-900/90 px-3.5 py-1.5 text-xs font-bold tracking-wider text-white uppercase border border-white/20">
                Item Sold
              </span>
            </div>
          )}

          {isReserved && !isSold && (
            <div className="absolute bottom-2.5 left-2.5">
              <Badge variant="reserved" className="shadow-sm">
                Reserved
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category & Condition Row */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
            <span className="font-medium text-neutral-600 truncate max-w-[60%]">
              {product.category}
            </span>
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
              {product.condition}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#ff4000] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span
              className={`text-lg font-black tracking-tight ${
                product.listingType === "Free" ? "text-emerald-600" : "text-neutral-900"
              }`}
            >
              {formatPrice(product.price, product.listingType)}
            </span>
            {product.listingType === "For Sale" && (
              <span className="text-[11px] text-neutral-400 font-normal">Negotiable</span>
            )}
          </div>

          {/* Seller & Campus Info */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
            <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span className="truncate font-medium">{product.seller?.name || "Campus Student"}</span>
            {product.location && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="truncate text-neutral-500">{product.location}</span>
              </>
            )}
          </div>

          {/* Card Footer with View Details Button */}
          <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[11px] text-neutral-400 truncate max-w-[60%]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{product.seller?.college || "Hostel Campus"}</span>
            </div>
            <div className="inline-flex items-center gap-1 font-semibold text-[#ff4000] group-hover:translate-x-0.5 transition-transform text-xs">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
