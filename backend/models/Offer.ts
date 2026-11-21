import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOfferDocument extends Document {
  product: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  offeredPrice: number;
  message?: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOfferDocument>(
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
    offeredPrice: {
      type: Number,
      required: [true, "Offered price is required"],
      min: [1, "Offered price must be greater than zero"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Accepted", "Rejected"],
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

const Offer: Model<IOfferDocument> =
  mongoose.models.Offer ||
  mongoose.model<IOfferDocument>("Offer", OfferSchema);

export default Offer;

