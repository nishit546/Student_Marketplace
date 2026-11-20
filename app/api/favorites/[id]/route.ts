import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

const DEFAULT_USER_ID = "demo_student_arnav";

/**
 * DELETE /api/favorites/[id]
 * Removes a favorite by Favorite document _id or by productId.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_USER_ID;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Favorite or Product ID is required" },
        { status: 400 }
      );
    }

    let deleted = null;

    // 1. Try deleting by Favorite _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Favorite.findOneAndDelete({
        _id: id,
        userId,
      });
    }

    // 2. If not deleted, try deleting by productId (ObjectId or string)
    if (!deleted) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        deleted = await Favorite.findOneAndDelete({
          productId: id,
          userId,
        });
      }
    }

    // 3. Fallback: query any favorite matching this user and productId
    if (!deleted) {
      deleted = await Favorite.findOneAndDelete({
        $or: [{ _id: id }, { productId: id }],
        userId,
      });
    }

    if (!deleted) {
      // Return 200 with already removed status (idempotent)
      return NextResponse.json({
        success: true,
        message: "Item removed from favorites",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from favorites successfully",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/favorites/[id] error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove favorite";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

