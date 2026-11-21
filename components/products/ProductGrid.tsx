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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 mb-3">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">No items match your criteria</h3>
        <p className="mt-1 max-w-sm text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Try broadening your search keyword or clearing active filters.
        </p>
        {onResetFilters && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            size="sm"
            className="mt-5 rounded-lg border-neutral-300 hover:border-neutral-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
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
