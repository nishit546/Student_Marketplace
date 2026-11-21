import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavoriteDocument extends Document {
  userId: string;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
      index: true,
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

// Compound unique index to prevent duplicate favorites per user
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorite: Model<IFavoriteDocument> =
  mongoose.models.Favorite ||
  mongoose.model<IFavoriteDocument>("Favorite", FavoriteSchema);

export default Favorite;

