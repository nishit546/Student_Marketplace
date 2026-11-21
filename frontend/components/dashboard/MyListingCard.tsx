"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle,
  RotateCcw,
  Clock,
  MapPin,
} from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatTimeAgo } from "@/lib/utils";

interface MyListingCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleSold: (product: Product) => void;
}

export function MyListingCard({
  product,
  onEdit,
  onDelete,
  onToggleSold,
}: MyListingCardProps) {
  const productId = product.id || product._id || "";
  const isSold = product.status === "Sold";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-colors">
      {/* Left: Product Image & Details */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        <div className="relative aspect-square h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
          <Image
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
            }
            alt={product.name}
            fill
            sizes="96px"
            className={`object-cover ${isSold ? "grayscale opacity-60" : ""}`}
          />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-[9px] font-bold uppercase text-white tracking-wider">
                Sold
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold text-neutral-500">
              {product.category}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs text-neutral-500 font-medium">
              {product.condition}
            </span>
            <span className="text-neutral-300">•</span>
            {isSold ? (
              <Badge variant="sold">Sold</Badge>
            ) : product.status === "Reserved" ? (
              <Badge variant="reserved">Reserved</Badge>
            ) : (
              <Badge variant="available">Active</Badge>
            )}
          </div>

          <Link
            href={`/product/${productId}`}
            className="text-sm sm:text-base font-bold text-neutral-900 hover:text-[#ff4000] truncate transition-colors"
          >
            {product.name}
          </Link>

          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-base font-bold ${
                product.listingType === "Free"
                  ? "text-emerald-600"
                  : "text-neutral-900"
              }`}
            >
              {formatPrice(product.price, product.listingType)}
            </span>
            <span className="text-[11px] text-neutral-400">
              ({product.listingType})
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{product.location || "Campus"}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(product.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 shrink-0">
        {/* View Details */}
        <Link href={`/product/${productId}`}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg h-8 text-xs font-medium gap-1 text-neutral-600 hover:text-neutral-900"
            title="View Product Page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline">View</span>
          </Button>
        </Link>

        {/* Mark Sold/Available Toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onToggleSold(product)}
          className={`rounded-lg h-8 text-xs font-medium gap-1.5 transition-colors ${
            isSold
              ? "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
          }`}
          title={isSold ? "Mark as Available" : "Mark as Sold"}
        >
          {isSold ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Relist</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-neutral-400" />
              <span>Mark Sold</span>
            </>
          )}
        </Button>

        {/* Edit Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
          className="rounded-lg h-8 text-xs font-medium gap-1.5 border-neutral-300 text-neutral-700 hover:border-neutral-400"
          title="Edit Listing Details"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>Edit</span>
        </Button>

        {/* Delete Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product)}
          className="rounded-lg h-8 text-xs font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 px-2"
          title="Delete Listing"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
