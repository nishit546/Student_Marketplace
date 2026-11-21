import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

/**
 * GET /api/enquiries
 * Retrieve enquiries, optionally filtered by seller email or product ID.
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const sellerEmail = searchParams.get("sellerEmail");

    const query: Record<string, unknown> = {};

    if (productId) {
      if (mongoose.Types.ObjectId.isValid(productId)) {
        query.product = productId;
      }
    }

    const enquiries = await Enquiry.find(query)
      .populate("product")
      .sort({ createdAt: -1 })
      .lean();

    // If filtered by sellerEmail, filter matching populated product seller
    let filteredEnquiries = enquiries;
    if (sellerEmail) {
      const emailLower = sellerEmail.toLowerCase().trim();
      filteredEnquiries = enquiries.filter((e) => {
        const prod = e.product as unknown as Record<string, unknown> | null;
        if (!prod || !prod.seller) return false;
        const seller = prod.seller as Record<string, string>;
        return seller.email?.toLowerCase().trim() === emailLower;
      });
    }

    const sanitizedEnquiries = filteredEnquiries.map((e) => ({
      ...e,
      id: e._id ? (e._id as mongoose.Types.ObjectId).toString() : "",
      _id: e._id ? (e._id as mongoose.Types.ObjectId).toString() : "",
    }));

    return NextResponse.json({
      success: true,
      count: sanitizedEnquiries.length,
      data: sanitizedEnquiries,
    });
  } catch (error: unknown) {
    console.error("GET /api/enquiries error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch enquiries";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/enquiries
 * Submit a buyer enquiry to a seller.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { productId, buyerName, buyerEmail, message } = body;

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

    // 2. Prevent enquiries on sold products
    if (targetProduct.status === "Sold") {
      return NextResponse.json(
        {
          success: false,
          message: "This item has already been sold. Enquiries are disabled.",
        },
        { status: 400 }
      );
    }

    // 3. Validate Buyer Name
    if (!buyerName || typeof buyerName !== "string" || buyerName.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Buyer name must be at least 2 characters long.",
        },
        { status: 400 }
      );
    }

    // 4. Validate Buyer Email
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

    // 5. Validate Message
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Message must be at least 10 characters describing your inquiry.",
        },
        { status: 400 }
      );
    }

    // 6. Create Enquiry
    const newEnquiry = await Enquiry.create({
      product: targetProduct._id,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      message: message.trim(),
      status: "Pending",
    });

    const populatedEnquiry = await Enquiry.findById(newEnquiry._id)
      .populate("product")
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been sent to the seller successfully!",
        data: populatedEnquiry
          ? {
              ...populatedEnquiry,
              id: populatedEnquiry._id.toString(),
              _id: populatedEnquiry._id.toString(),
            }
          : newEnquiry,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/enquiries error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit enquiry";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
