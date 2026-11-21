"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="py-12 sm:py-16 bg-[#fafafa] border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Featured Listings
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Recommended items listed by students on campus.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#ff4000] hover:text-[#e03800]"
          >
            <span>See all listings ({products.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                type="button"
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
