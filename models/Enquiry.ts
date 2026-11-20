import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiryDocument extends Document {
  product: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  message: string;
  status: "Pending" | "Responded" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
    },
    buyerName: {
      type: String,
      required: [true, "Buyer name is required"],
      trim: true,
      minlength: [2, "Buyer name must be at least 2 characters"],
      maxlength: [80, "Buyer name cannot exceed 80 characters"],
    },
    buyerEmail: {
      type: String,
      required: [true, "Buyer email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Responded", "Closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id ? ret._id.toString() : "";
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id ? ret._id.toString() : "";
        return ret;
      },
    },
  }
);

const Enquiry: Model<IEnquiryDocument> =
  mongoose.models.Enquiry ||
  mongoose.model<IEnquiryDocument>("Enquiry", EnquirySchema);

export default Enquiry;

