import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeller {
  name: string;
  email: string;
  college?: string;
  year?: string;
  phone?: string;
  avatar?: string;
}

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  listingType: "For Sale" | "Exchange" | "Free";
  images: string[];
  seller: ISeller;
  location?: string;
  status: "Available" | "Sold" | "Reserved";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    name: {
      type: String,
      required: [true, "Seller name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Seller college email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    college: {
      type: String,
      trim: true,
      default: "Campus Hostel",
    },
    year: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      trim: true,
    },
    listingType: {
      type: String,
      required: [true, "Listing type is required"],
      enum: {
        values: ["For Sale", "Exchange", "Free"],
        message: "{VALUE} is not a valid listing type",
      },
      default: "For Sale",
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one product image is required",
      },
    },
    seller: {
      type: SellerSchema,
      required: [true, "Seller details are required"],
    },
    location: {
      type: String,
      trim: true,
      default: "Campus Premises",
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },
    featured: {
      type: Boolean,
      default: false,
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

// Add text index for fast search across title and description
ProductSchema.index({ name: "text", description: "text", category: "text" });

const Product: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;

