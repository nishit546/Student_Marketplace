"use client";

import * as React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
  savedProductIds?: string[];
  onToggleSave?: (productId: string) => void;
}

export function ProductGrid({
  products,
  onResetFilters,
  savedProductIds = [],
  onToggleSave,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2ee] text-[#ff4000] mb-4">
          <SearchX className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No matching campus items</h3>
        <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-neutral-500 leading-relaxed">
          We couldn’t find any listings matching your search or active filter criteria. Try adjusting your keyword or clearing filters.
        </p>
        {onResetFilters && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            className="mt-6 rounded-xl border-neutral-300 hover:border-[#ff4000] hover:text-[#ff4000]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All Filters</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const id = product.id || product._id || "";
        const isSaved = savedProductIds.includes(id);
        return (
          <ProductCard
            key={id}
            product={product}
            isSaved={isSaved}
            onToggleSave={onToggleSave}
          />
        );
      })}
    </div>
  );
}

