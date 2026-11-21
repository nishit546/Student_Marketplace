"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Recently Listed
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              New listings posted recently by campus students.
            </p>
          </div>

          <Link
            href="/explore?sort=newest"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#ff4000] hover:text-[#e03800]"
          >
            <span>Browse latest</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
