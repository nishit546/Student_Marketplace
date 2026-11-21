import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Offer from "@/models/Offer";

/**
 * PATCH /api/offers/[id]
 * Updates status of a price offer ("Pending" | "Accepted" | "Rejected").
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Valid offer ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["Pending", "Accepted", "Rejected"];
    const normalizedStatus =
      status && typeof status === "string"
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "";

    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Status must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { status: normalizedStatus },
      { new: true, runValidators: true }
    )
      .populate("product")
      .lean();

    if (!updatedOffer) {
      return NextResponse.json(
        { success: false, message: "Price offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Offer ${normalizedStatus.toLowerCase()} successfully`,
      data: {
        ...updatedOffer,
        id: updatedOffer._id.toString(),
        _id: updatedOffer._id.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("PATCH /api/offers/[id] error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update offer";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

