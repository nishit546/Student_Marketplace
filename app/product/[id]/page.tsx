import { getProductById } from "@/lib/sample-data";
import { ProductPageContainer } from "@/components/products/ProductPageContainer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return {
      title: "Campus Listing Details – CampusKart",
    };
  }
  return {
    title: `${product.name} – CampusKart`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductPageContainer id={id} />;
}
