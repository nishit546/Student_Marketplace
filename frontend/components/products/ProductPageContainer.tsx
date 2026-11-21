"use client";

import * as React from "react";
import { useProducts } from "@/context/ProductsContext";
import { ProductDetailsView } from "@/components/products/ProductDetailsView";
import ProductNotFound from "@/app/product/[id]/not-found";
import { Product } from "@/types";

interface ProductPageContainerProps {
  id: string;
}

export function ProductPageContainer({ id }: ProductPageContainerProps) {
  const { getProductById, isLoaded, products } = useProducts();
  const [fetchedProduct, setFetchedProduct] = React.useState<Product | null>(null);
  const [isFetchingDirect, setIsFetchingDirect] = React.useState(false);
  const [fetchAttempted, setFetchAttempted] = React.useState(false);

  const contextProduct = getProductById(id);
  const product = contextProduct || fetchedProduct;

  // Direct fetch fallback if listing is not in memory cache
  React.useEffect(() => {
    if (!contextProduct && isLoaded && !fetchAttempted) {
      let isMounted = true;
      setIsFetchingDirect(true);

      fetch(`/api/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((json) => {
          if (isMounted && json.success && json.data) {
            const p = json.data;
            setFetchedProduct({
              ...p,
              id: p.id || p._id || id,
              _id: p._id || p.id || id,
            });
          }
        })
        .catch(() => {
          // Leave product as null to trigger 404
        })
        .finally(() => {
          if (isMounted) {
            setIsFetchingDirect(false);
            setFetchAttempted(true);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [contextProduct, isLoaded, id, fetchAttempted]);

  if (!isLoaded || isFetchingDirect) {
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
        p.id !== product.id &&
        p._id !== product.id &&
        p.id !== product._id &&
        p._id !== product._id &&
        (p.category.toLowerCase().includes(product.category.toLowerCase()) ||
          product.category.toLowerCase().includes(p.category.toLowerCase()))
    )
    .slice(0, 4);

  return (
    <ProductDetailsView product={product} similarProducts={similarProducts} />
  );
}
