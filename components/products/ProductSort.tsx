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
        <span>Sort by:</span>
      </label>
      <select
        id="product-sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-neutral-200/90 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-neutral-800 shadow-sm transition-all focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20 cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}

