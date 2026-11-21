"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts() {
  const { products } = useProducts();
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All");

  const filterTabs = [
    "All",
    "Books",
    "Electronics",
    "Furniture",
    "Stationery",
    "Sports",
    "Free Giveaways",
  ];

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      if (selectedFilter === "All") return true;
      if (selectedFilter === "Free Giveaways") return product.listingType === "Free";
      return product.category.toLowerCase().includes(selectedFilter.toLowerCase());
    });
  }, [selectedFilter, products]);

  return (
    <section className="py-14 sm:py-20 bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#ff4000] uppercase mb-1.5">
              <Flame className="h-3.5 w-3.5 fill-[#ff4000]" />
              <span>Campus Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Verified high-demand items listed by students across hostelled campuses.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff4000] hover:text-[#e03800] group"
          >
            <span>See All Listings ({products.length})</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                type="button"
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#ff4000] text-white shadow-sm"
                    : "bg-white text-neutral-600 border border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>

        {/* Empty state if filter has no products */}
        {filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <p className="text-sm text-neutral-500">No items match this filter right now.</p>
            <button
              onClick={() => setSelectedFilter("All")}
              className="mt-3 text-xs font-semibold text-[#ff4000] hover:underline"
            >
              Reset to all products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

