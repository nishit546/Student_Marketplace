"use client";

import * as React from "react";
import { RotateCcw, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterState {
  category: string;
  condition: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const CATEGORY_OPTIONS = [
  "All",
  "Books",
  "Electronics",
  "Furniture",
  "Stationery",
  "Sports",
  "Other",
];

export const CONDITION_OPTIONS = ["All", "New", "Like New", "Good", "Fair"];

export const LISTING_TYPE_OPTIONS = ["All", "For Sale", "Exchange", "Free"];

export function ProductFilters({
  filters,
  onChange,
  onReset,
  isMobileOpen = false,
  onMobileClose,
}: ProductFiltersProps) {
  const activeFiltersCount =
    (filters.category && filters.category !== "All" ? 1 : 0) +
    (filters.condition && filters.condition !== "All" ? 1 : 0) +
    (filters.listingType && filters.listingType !== "All" ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  const handleCategoryClick = (cat: string) => {
    onChange({ ...filters, category: cat === filters.category ? "All" : cat });
  };

  const handleConditionClick = (cond: string) => {
    onChange({ ...filters, condition: cond === filters.condition ? "All" : cond });
  };

  const handleListingTypeClick = (type: string) => {
    onChange({ ...filters, listingType: type === filters.listingType ? "All" : type });
  };

  const content = (
    <div className="flex flex-col gap-5">
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-neutral-600" />
          <span className="font-semibold text-sm text-neutral-900">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#ff4000] text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-[#ff4000] hover:text-[#e03800] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-900 mb-2">
          Category
        </h4>
        <div className="flex flex-col gap-0.5">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected =
              filters.category === cat || (!filters.category && cat === "All");
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#fff2ee] text-[#ff4000] font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <span>{cat === "All" ? "All Categories" : cat}</span>
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff4000]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Listing Type Filter */}
      <div className="border-t border-neutral-100 pt-4">
        <h4 className="text-xs font-semibold text-neutral-900 mb-2">
          Listing Type
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {LISTING_TYPE_OPTIONS.map((type) => {
            const isSelected =
              filters.listingType === type || (!filters.listingType && type === "All");
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleListingTypeClick(type)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 text-white font-medium"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                {type === "All" ? "All Types" : type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Condition Filter */}
      <div className="border-t border-neutral-100 pt-4">
        <h4 className="text-xs font-semibold text-neutral-900 mb-2">
          Condition
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {CONDITION_OPTIONS.map((cond) => {
            const isSelected =
              filters.condition === cond || (!filters.condition && cond === "All");
            return (
              <button
                key={cond}
                type="button"
                onClick={() => handleConditionClick(cond)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 text-white font-medium"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                {cond === "All" ? "All Conditions" : cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range Filter */}
      <div className="border-t border-neutral-100 pt-4">
        <h4 className="text-xs font-semibold text-neutral-900 mb-2">
          Price Range (₹)
        </h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full rounded-md border border-neutral-300 bg-white py-1.5 pl-6 pr-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>
          <span className="text-neutral-400 text-xs">to</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full rounded-md border border-neutral-300 bg-white py-1.5 pl-6 pr-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick price presets */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ ...filters, minPrice: "0", maxPrice: "500" })}
            className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 hover:bg-neutral-200 cursor-pointer"
          >
            Under ₹500
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, minPrice: "500", maxPrice: "1500" })}
            className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 hover:bg-neutral-200 cursor-pointer"
          >
            ₹500 - ₹1,500
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...filters, minPrice: "1500", maxPrice: "" })}
            className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 hover:bg-neutral-200 cursor-pointer"
          >
            ₹1,500+
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter Card */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-20 rounded-lg border border-neutral-200 bg-white p-4">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer Filter */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          {/* Drawer content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <span className="font-semibold text-sm text-neutral-900">Filters</span>
              <button
                onClick={onMobileClose}
                className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {content}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Button
                onClick={onMobileClose}
                className="w-full justify-center"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
