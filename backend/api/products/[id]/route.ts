import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * GET /api/products/[id]
 * Fetch a single product by its MongoDB _id or string id.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    if (!product) {
      product = await Product.findOne({
        $or: [{ id: id }, { _id: id }],
      }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        _id: product._id ? product._id.toString() : id,
        id: product._id ? product._id.toString() : id,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/products/[id] error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to retrieve product";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Update a product by its ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Prevent direct immutable field tampering
    const updates = { ...body };
    delete updates._id;
    delete updates.id;
    delete updates.createdAt;
    updates.updatedAt = new Date();

    let updatedProduct = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedProduct = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).lean();
    }

    if (!updatedProduct) {
      updatedProduct = await Product.findOneAndUpdate(
        { $or: [{ id: id }, { _id: id }] },
        updates,
        { new: true, runValidators: true }
      ).lean();
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found or could not be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product listing updated successfully",
      data: {
        ...updatedProduct,
        _id: updatedProduct._id ? updatedProduct._id.toString() : id,
        id: updatedProduct._id ? updatedProduct._id.toString() : id,
      },
    });
  } catch (error: unknown) {
    console.error("PUT /api/products/[id] error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update product listing";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product by its ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    let deletedProduct = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedProduct = await Product.findByIdAndDelete(id).lean();
    }

    if (!deletedProduct) {
      deletedProduct = await Product.findOneAndDelete({
        $or: [{ id: id }, { _id: id }],
      }).lean();
    }

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product listing deleted successfully",
      data: {
        ...deletedProduct,
        _id: deletedProduct._id ? deletedProduct._id.toString() : id,
        id: deletedProduct._id ? deletedProduct._id.toString() : id,
      },
    });
  } catch (error: unknown) {
    console.error("DELETE /api/products/[id] error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete product listing";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
