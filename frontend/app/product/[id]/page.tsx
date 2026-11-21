import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { getProductById } from "@/lib/sample-data";
import { ProductPageContainer } from "@/components/products/ProductPageContainer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  let productTitle = "Campus Listing Details";
  let productDesc = "Buy and sell second-hand student essentials on CampusKart.";

  try {
    await connectToDatabase();
    let productDoc = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      productDoc = await Product.findById(id).lean();
    }
    if (!productDoc) {
      productDoc = await Product.findOne({ $or: [{ id }, { _id: id }] }).lean();
    }
    if (productDoc) {
      productTitle = productDoc.name;
      productDesc = productDoc.description;
    }
  } catch {
    // If DB is offline, fallback to sample data
    const sample = getProductById(id);
    if (sample) {
      productTitle = sample.name;
      productDesc = sample.description;
    }
  }

  return {
    title: `${productTitle} – CampusKart`,
    description: productDesc,
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
