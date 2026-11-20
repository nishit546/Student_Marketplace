import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Offer from "@/models/Offer";
import Product from "@/models/Product";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

/**
 * GET /api/offers
 * Retrieve price offers, optionally filtered by product ID or seller email.
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const sellerEmail = searchParams.get("sellerEmail");

    const query: Record<string, unknown> = {};

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      query.product = productId;
    }

    const offers = await Offer.find(query)
      .populate("product")
      .sort({ createdAt: -1 })
      .lean();

    // If filtered by sellerEmail, filter matching populated product seller
    let filteredOffers = offers;
    if (sellerEmail) {
      const emailLower = sellerEmail.toLowerCase().trim();
      filteredOffers = offers.filter((o) => {
        const prod = o.product as unknown as Record<string, unknown> | null;
        if (!prod || !prod.seller) return false;
        const seller = prod.seller as Record<string, string>;
        return seller.email?.toLowerCase().trim() === emailLower;
      });
    }

    const sanitizedOffers = filteredOffers.map((o) => ({
      ...o,
      id: o._id ? (o._id as mongoose.Types.ObjectId).toString() : "",
      _id: o._id ? (o._id as mongoose.Types.ObjectId).toString() : "",
    }));

    return NextResponse.json({
      success: true,
      count: sanitizedOffers.length,
      data: sanitizedOffers,
    });
  } catch (error: unknown) {
    console.error("GET /api/offers error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch offers";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/offers
 * Propose a counter-price offer for a product.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId, buyerName, buyerEmail, offeredPrice, message } = body;

    // 1. Validate Product ID
    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid productId is required" },
        { status: 400 }
      );
    }

    let targetProduct = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      targetProduct = await Product.findById(productId);
    }

    if (!targetProduct) {
      targetProduct = await Product.findOne({
        $or: [{ id: productId }, { _id: productId }],
      });
    }

    // Seed sample product if not yet in database
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
        { success: false, message: "Product listing not found" },
        { status: 404 }
      );
    }

    // 2. Prevent offers on sold products
    if (targetProduct.status === "Sold") {
      return NextResponse.json(
        {
          success: false,
          message: "This item has already been sold. Price offers are closed.",
        },
        { status: 400 }
      );
    }

    // 3. Prevent offers on non-sale listings (Exchange or Free)
    if (targetProduct.listingType !== "For Sale") {
      return NextResponse.json(
        {
          success: false,
          message: `Price offers are only allowed on items listed 'For Sale'. This item is '${targetProduct.listingType}'.`,
        },
        { status: 400 }
      );
    }

    // 4. Validate Offered Price
    const numericOffer = Number(offeredPrice);
    if (isNaN(numericOffer) || numericOffer <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Offered price must be a valid positive number in ₹.",
        },
        { status: 400 }
      );
    }

    if (numericOffer > targetProduct.price) {
      return NextResponse.json(
        {
          success: false,
          message: `Offered price (₹${numericOffer}) cannot exceed the seller's asking price of ₹${targetProduct.price}.`,
        },
        { status: 400 }
      );
    }

    // 5. Validate Buyer Name
    if (!buyerName || typeof buyerName !== "string" || buyerName.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Buyer name must be at least 2 characters long.",
        },
        { status: 400 }
      );
    }

    // 6. Validate Buyer Email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!buyerEmail || typeof buyerEmail !== "string" || !emailRegex.test(buyerEmail.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid college email address.",
        },
        { status: 400 }
      );
    }

    // 7. Create Offer
    const newOffer = await Offer.create({
      product: targetProduct._id,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      offeredPrice: numericOffer,
      message: message ? message.trim() : "",
      status: "Pending",
    });

    const populatedOffer = await Offer.findById(newOffer._id)
      .populate("product")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: `Your price offer of ₹${numericOffer} has been submitted to ${targetProduct.seller.name}!`,
        data: populatedOffer
          ? {
              ...populatedOffer,
              id: populatedOffer._id.toString(),
              _id: populatedOffer._id.toString(),
            }
          : newOffer,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/offers error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit price offer";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
