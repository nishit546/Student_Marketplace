"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="product-sort" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500 whitespace-nowrap">
        <ArrowUpDown className="h-3.5 w-3.5" />
        <span>Sort:</span>
      </label>
      <select
        id="product-sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-800 focus:border-neutral-400 focus:outline-none cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
