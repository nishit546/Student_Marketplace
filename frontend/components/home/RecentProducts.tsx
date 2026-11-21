"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/products/ProductCard";

export function RecentProducts() {
  const { products } = useProducts();

  // Sort by newest
  const recentProducts = React.useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [products]);

  return (
    <section className="py-14 sm:py-20 bg-white border-y border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#ff4000] uppercase mb-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Just Added</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Recently Listed on Campus
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Fresh listings posted today by students in hostelled blocks and nearby residences.
            </p>
          </div>

          <Link
            href="/explore?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff4000] hover:text-[#e03800] group"
          >
            <span>Browse Latest</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

