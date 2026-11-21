import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import Product from "@/models/Product";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

const DEFAULT_USER_ID = "demo_student_arnav";

/**
 * GET /api/favorites
 * Returns all favorited products for the user (defaulting to demo user).
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_USER_ID;

    const favorites = await Favorite.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 })
      .lean();

    // Map populated products and filter out any deleted ones
    const favoritedProducts = favorites
      .filter((fav) => fav.productId !== null && typeof fav.productId === "object")
      .map((fav) => {
        const prod = fav.productId as unknown as Record<string, unknown>;
        const pId = prod._id ? (prod._id as mongoose.Types.ObjectId).toString() : (prod.id as string);
        return {
          ...prod,
          id: pId,
          _id: pId,
          favoriteId: fav._id ? (fav._id as mongoose.Types.ObjectId).toString() : "",
          isSaved: true,
        };
      });

    return NextResponse.json({
      success: true,
      count: favoritedProducts.length,
      data: favoritedProducts,
    });
  } catch (error: unknown) {
    console.error("GET /api/favorites error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch favorites";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Adds a product to favorites, preventing duplicates.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId } = body;
    const userId = body.userId || DEFAULT_USER_ID;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid productId is required" },
        { status: 400 }
      );
    }

    // 1. Locate product in MongoDB or seed from sample products if needed
    let targetProduct = null;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      targetProduct = await Product.findById(productId);
    }

    if (!targetProduct) {
      targetProduct = await Product.findOne({
        $or: [{ id: productId }, { _id: productId }],
      });
    }

    // If not found in DB (e.g. sample product not yet in DB), seed it
    if (!targetProduct) {
      const sample = SAMPLE_PRODUCTS.find(
        (p) => p.id === productId || p._id === productId
      );
      if (sample) {
        targetProduct = await Product.create({
          name: sample.name,
          description: sample.description,
          price: sample.price,
          category: sample.category,
          condition: sample.condition,
          listingType: (sample.listingType as "For Sale" | "Exchange" | "Free") || "For Sale",
          images: sample.images,
          seller: sample.seller,
          location: sample.location || "Campus Premises",
          status: sample.status || "Available",
          featured: sample.featured || false,
        });
      }
    }

    if (!targetProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const actualMongoId = targetProduct._id;

    // 2. Check for duplicate favorite
    const existing = await Favorite.findOne({
      userId,
      productId: actualMongoId,
    }).lean();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Product is already in favorites",
        data: {
          ...existing,
          id: existing._id.toString(),
          _id: existing._id.toString(),
        },
      });
    }

    // 3. Create favorite
    const newFavorite = await Favorite.create({
      userId,
      productId: actualMongoId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added to favorites successfully",
        data: {
          ...newFavorite.toObject(),
          id: newFavorite._id.toString(),
          _id: newFavorite._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/favorites error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add favorite";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
