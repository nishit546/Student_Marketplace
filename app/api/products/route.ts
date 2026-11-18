import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { SAMPLE_PRODUCTS } from "@/lib/sample-data";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed initial sample products if database is completely empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const sanitizedSamples = SAMPLE_PRODUCTS.map((p) => ({
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        condition: p.condition,
        listingType: p.listingType,
        images: p.images,
        seller: p.seller,
        location: p.location || "Campus Premises",
        status: p.status || "Available",
        featured: p.featured || false,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt || p.createdAt),
      }));

      await Product.insertMany(sanitizedSamples);
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const listingType = searchParams.get("listingType") || searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const sellerEmail = searchParams.get("sellerEmail");

    // Build query filter
    const filter: Record<string, unknown> = {};

    // 1. Text / Keyword Search
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { "seller.name": { $regex: searchRegex } },
      ];
    }

    // 2. Category Filter (case-insensitive substring match)
    if (category && category !== "All") {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    // 3. Condition Filter
    if (condition && condition !== "All") {
      if (condition.toLowerCase() === "new") {
        filter.condition = { $in: [/new/i, /brand new/i] };
      } else {
        filter.condition = { $regex: new RegExp(`^${condition}$`, "i") };
      }
    }

    // 4. Listing Type Filter
    if (listingType && listingType !== "All") {
      filter.listingType = { $regex: new RegExp(`^${listingType}$`, "i") };
    }

    // 5. Price Range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        (filter.price as Record<string, number>).$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        (filter.price as Record<string, number>).$lte = Number(maxPrice);
      }
    }

    // 6. Featured
    if (featured === "true") {
      filter.featured = true;
    }

    // 7. Seller Email filter
    if (sellerEmail) {
      filter["seller.email"] = sellerEmail.toLowerCase().trim();
    }

    // Build Sorting options
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1, createdAt: -1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const products = await Product.find(filter).sort(sortOption).lean();

    const sanitizedProducts = products.map((doc) => ({
      ...doc,
      _id: doc._id ? doc._id.toString() : "",
      id: doc._id ? doc._id.toString() : "",
    }));

    return NextResponse.json({
      success: true,
      count: sanitizedProducts.length,
      data: sanitizedProducts,
    });
  } catch (error: unknown) {
    console.error("GET /api/products error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch products";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Field Validations
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Product title must be at least 3 characters long.",
        },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must be at least 10 characters long.",
        },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        { success: false, message: "Please specify a product category." },
        { status: 400 }
      );
    }

    if (!body.condition) {
      return NextResponse.json(
        { success: false, message: "Please specify product condition." },
        { status: 400 }
      );
    }

    const listingType = body.listingType || "For Sale";
    const price = listingType === "Free" ? 0 : Number(body.price);

    if (listingType === "For Sale" && (isNaN(price) || price <= 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid positive number for items for sale.",
        },
        { status: 400 }
      );
    }

    if (!body.seller || !body.seller.name || !body.seller.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller name and college email are required.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(body.seller.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid college email address.",
        },
        { status: 400 }
      );
    }

    if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one product image is required.",
        },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name: body.name.trim(),
      description: body.description.trim(),
      price: price,
      category: body.category.trim(),
      condition: body.condition.trim(),
      listingType: listingType,
      images: body.images,
      seller: {
        name: body.seller.name.trim(),
        email: body.seller.email.trim().toLowerCase(),
        college: body.seller.college || "Campus Hostel",
        year: body.seller.year,
        phone: body.seller.phone,
        avatar: body.seller.avatar,
      },
      location: body.location || body.seller.college || "Campus Premises",
      status: body.status || "Available",
      featured: Boolean(body.featured),
    });

    const sanitizedProduct = {
      ...newProduct.toObject(),
      _id: newProduct._id ? newProduct._id.toString() : "",
      id: newProduct._id ? newProduct._id.toString() : "",
    };

    return NextResponse.json(
      {
        success: true,
        data: sanitizedProduct,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/products error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create product listing";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
