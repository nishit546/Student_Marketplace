import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * POST /api/products/migrate
 * Accepts an array of client-stored products (from localStorage Phase 3)
 * and safely inserts any missing ones into MongoDB.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const productsToMigrate = Array.isArray(body)
      ? body
      : body.products && Array.isArray(body.products)
      ? body.products
      : [];

    if (productsToMigrate.length === 0) {
      return NextResponse.json({
        success: true,
        migratedCount: 0,
        message: "No products provided for migration.",
      });
    }

    let migratedCount = 0;

    for (const item of productsToMigrate) {
      if (!item.name || !item.seller?.email) continue;

      // Check if product already exists by title and seller email
      const existing = await Product.findOne({
        name: item.name.trim(),
        "seller.email": item.seller.email.trim().toLowerCase(),
      });

      if (!existing) {
        await Product.create({
          name: item.name.trim(),
          description: item.description?.trim() || "Item listed on CampusKart",
          price: item.listingType === "Free" ? 0 : Number(item.price) || 0,
          category: item.category?.trim() || "Other",
          condition: item.condition?.trim() || "Good",
          listingType: item.listingType || "For Sale",
          images:
            Array.isArray(item.images) && item.images.length > 0
              ? item.images
              : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
          seller: {
            name: item.seller.name?.trim() || "Campus Student",
            email: item.seller.email?.trim().toLowerCase() || "student@college.edu",
            college: item.seller.college || "Campus Hostel",
            year: item.seller.year,
            phone: item.seller.phone,
            avatar: item.seller.avatar,
          },
          location: item.location || "Campus Premises",
          status: item.status || "Available",
          featured: Boolean(item.featured),
        });
        migratedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      migratedCount,
      message: `Successfully migrated ${migratedCount} local products to MongoDB.`,
    });
  } catch (error: unknown) {
    console.error("POST /api/products/migrate error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to migrate products";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

