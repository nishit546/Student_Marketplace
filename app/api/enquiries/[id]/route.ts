import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

/**
 * PATCH /api/enquiries/[id]
 * Updates status of an enquiry ("Pending" | "Responded" | "Closed").
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
        { success: false, message: "Valid enquiry ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["Pending", "Responded", "Closed"];
    // Capitalize first letter to normalize
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

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status: normalizedStatus },
      { new: true, runValidators: true }
    )
      .populate("product")
      .lean();

    if (!updatedEnquiry) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated successfully",
      data: {
        ...updatedEnquiry,
        id: updatedEnquiry._id.toString(),
        _id: updatedEnquiry._id.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("PATCH /api/enquiries/[id] error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update enquiry";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

