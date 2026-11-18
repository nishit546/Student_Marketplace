"use client";

import * as React from "react";
import { useProducts } from "@/context/ProductsContext";
import { ProductDetailsView } from "@/components/products/ProductDetailsView";
import ProductNotFound from "@/app/product/[id]/not-found";
import { getSimilarProducts } from "@/lib/sample-data";

interface ProductPageContainerProps {
  id: string;
}

export function ProductPageContainer({ id }: ProductPageContainerProps) {
  const { getProductById, isLoaded, products } = useProducts();

  const product = getProductById(id);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff4000] border-t-transparent" />
          <p className="text-xs text-neutral-500 font-medium">Loading campus listing...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductNotFound />;
  }

  // Calculate similar products from live context
  const similarProducts = products
    .filter(
      (p) =>
        (p.id !== product.id && p._id !== product.id) &&
        (p.category.toLowerCase().includes(product.category.toLowerCase()) ||
          product.category.toLowerCase().includes(p.category.toLowerCase()))
    )
    .slice(0, 4);

  return (
    <ProductDetailsView product={product} similarProducts={similarProducts} />
  );
}

