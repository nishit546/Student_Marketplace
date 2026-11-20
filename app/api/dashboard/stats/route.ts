import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Enquiry from "@/models/Enquiry";
import Offer from "@/models/Offer";

const DEMO_SELLER_EMAIL = "arnav.gupta@college.edu";

/**
 * GET /api/dashboard/stats
 * Returns aggregated dashboard statistics for the demo seller.
 */
export async function GET() {
  try {
    await connectToDatabase();

    // All products by demo seller
    const allProducts = await Product.find({
      "seller.email": DEMO_SELLER_EMAIL,
    })
      .sort({ createdAt: -1 })
      .lean();

    const productIds = allProducts.map((p) => p._id);

    const totalListings = allProducts.length;
    const activeListings = allProducts.filter((p) => p.status === "Available").length;
    const soldListings = allProducts.filter((p) => p.status === "Sold").length;
    const totalActiveValue = allProducts
      .filter((p) => p.status === "Available" && p.listingType === "For Sale")
      .reduce((sum, p) => sum + (p.price || 0), 0);

    // Enquiries for seller products
    const allEnquiries = await Enquiry.find({
      product: { $in: productIds },
    })
      .populate("product")
      .sort({ createdAt: -1 })
      .lean();

    const pendingEnquiries = allEnquiries.filter((e) => e.status === "Pending").length;

    // Offers for seller products
    const allOffers = await Offer.find({
      product: { $in: productIds },
    })
      .populate("product")
      .sort({ createdAt: -1 })
      .lean();

    const pendingOffers = allOffers.filter((o) => o.status === "Pending").length;

    const formattedRecentListings = allProducts.slice(0, 5).map((p) => {
      const idStr = p._id ? String(p._id) : "";
      return {
        ...p,
        _id: idStr,
        id: idStr,
      };
    });

    const formattedRecentEnquiries = allEnquiries.slice(0, 5).map((e) => {
      const idStr = e._id ? String(e._id) : "";
      let prodObj: unknown = e.product;
      if (prodObj && typeof prodObj === "object") {
        const pRecord = prodObj as Record<string, unknown>;
        const pIdStr = pRecord._id ? String(pRecord._id) : "";
        prodObj = {
          ...pRecord,
          _id: pIdStr,
          id: pIdStr,
        };
      }
      return {
        ...e,
        _id: idStr,
        id: idStr,
        product: prodObj,
      };
    });

    const formattedRecentOffers = allOffers.slice(0, 5).map((o) => {
      const idStr = o._id ? String(o._id) : "";
      let prodObj: unknown = o.product;
      if (prodObj && typeof prodObj === "object") {
        const pRecord = prodObj as Record<string, unknown>;
        const pIdStr = pRecord._id ? String(pRecord._id) : "";
        prodObj = {
          ...pRecord,
          _id: pIdStr,
          id: pIdStr,
        };
      }
      return {
        ...o,
        _id: idStr,
        id: idStr,
        product: prodObj,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalListings,
        activeListings,
        soldListings,
        pendingEnquiries,
        pendingOffers,
        totalActiveValue,
        recentListings: formattedRecentListings,
        recentEnquiries: formattedRecentEnquiries,
        recentOffers: formattedRecentOffers,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/dashboard/stats error:", error);
    const msg = error instanceof Error ? error.message : "Failed to load dashboard stats";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
