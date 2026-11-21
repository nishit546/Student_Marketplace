"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProductSearch({
  value,
  onChange,
  placeholder = "Search by item name, notes, description, or category...",
}: ProductSearchProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Search className="h-4 w-4 text-neutral-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200/90 bg-white py-2.5 pl-10 pr-9 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm transition-all focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

