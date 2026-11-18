"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useProducts, DEMO_USER } from "@/context/ProductsContext";
import { Product } from "@/types";
import { FormField } from "@/components/sell/FormField";
import { ImageUploader } from "@/components/sell/ImageUploader";
import { Button } from "@/components/ui/button";

interface SellProductFormProps {
  initialProduct?: Product;
  isEditing?: boolean;
  onSuccess?: (product: Product) => void;
}

const CATEGORIES = [
  "Books",
  "Electronics",
  "Furniture",
  "Stationery",
  "Sports",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair"];

const LISTING_TYPES = ["For Sale", "Exchange", "Free"];

export function SellProductForm({
  initialProduct,
  isEditing = false,
  onSuccess,
}: SellProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct } = useProducts();

  // Form Fields
  const [name, setName] = React.useState(initialProduct?.name || "");
  const [description, setDescription] = React.useState(
    initialProduct?.description || ""
  );
  const [price, setPrice] = React.useState<string>(
    initialProduct ? String(initialProduct.price) : ""
  );
  const [category, setCategory] = React.useState(
    initialProduct?.category || "Books"
  );
  const [condition, setCondition] = React.useState(
    initialProduct?.condition || "Good"
  );
  const [listingType, setListingType] = React.useState(
    initialProduct?.listingType || "For Sale"
  );
  const [images, setImages] = React.useState<string[]>(
    initialProduct?.images || []
  );
  const [sellerName, setSellerName] = React.useState(
    initialProduct?.seller.name || DEMO_USER.name
  );
  const [sellerEmail, setSellerEmail] = React.useState(
    initialProduct?.seller.email || DEMO_USER.email
  );
  const [location, setLocation] = React.useState(
    initialProduct?.location || initialProduct?.seller.college || DEMO_USER.college
  );

  // Validation Errors
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successProduct, setSuccessProduct] = React.useState<Product | null>(null);

  // Validate fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Please enter a product title.";
    } else if (name.trim().length < 3) {
      newErrors.name = "Title must be at least 3 characters.";
    }

    if (!description.trim()) {
      newErrors.description = "Please describe your item.";
    } else if (description.trim().length < 10) {
      newErrors.description = "Please provide at least 10 characters describing the item.";
    }

    if (listingType === "For Sale") {
      const numPrice = parseFloat(price);
      if (!price || isNaN(numPrice) || numPrice <= 0) {
        newErrors.price = "Enter a valid positive price in ₹ for items listed for sale.";
      }
    }

    if (!category) {
      newErrors.category = "Please select a category.";
    }

    if (!condition) {
      newErrors.condition = "Please select the condition.";
    }

    if (!sellerName.trim()) {
      newErrors.sellerName = "Please provide seller name.";
    }

    if (!sellerEmail.trim() || !sellerEmail.includes("@")) {
      newErrors.sellerEmail = "Please provide a valid college email address.";
    }

    if (images.length === 0) {
      newErrors.images = "Please attach at least one photo of the item.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const calculatedPrice =
      listingType === "Free" ? 0 : parseFloat(price) || 0;

    if (isEditing && initialProduct) {
      const pId = initialProduct.id || initialProduct._id || "";
      const updatedData: Partial<Product> = {
        name: name.trim(),
        description: description.trim(),
        price: calculatedPrice,
        category,
        condition,
        listingType,
        images,
        location: location.trim(),
        seller: {
          ...initialProduct.seller,
          name: sellerName.trim(),
          email: sellerEmail.trim(),
          college: location.trim(),
        },
      };

      await updateProduct(pId, updatedData);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess({ ...initialProduct, ...updatedData } as Product);
      } else {
        router.push(`/product/${pId}`);
      }
    } else {
      // New Listing
      const newProduct = await addProduct({
        name: name.trim(),
        description: description.trim(),
        price: calculatedPrice,
        category,
        condition,
        listingType,
        images,
        location: location.trim(),
        seller: {
          name: sellerName.trim(),
          email: sellerEmail.trim(),
          college: location.trim(),
          year: "3rd Year Student",
          phone: "+91 98765 43210",
        },
        status: "Available",
        featured: false,
      });

      setIsSubmitting(false);
      setSuccessProduct(newProduct);

      if (onSuccess) {
        onSuccess(newProduct);
      } else {
        // Smooth redirect to newly created product
        setTimeout(() => {
          router.push(`/product/${newProduct.id || newProduct._id}`);
        }, 1200);
      }
    }
  };

  if (successProduct) {
    return (
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-12 text-center shadow-lg animate-in zoom-in-95">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-5">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
          Listing Published Successfully!
        </h2>
        <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
          Your product <strong className="text-neutral-900">&quot;{successProduct.name}&quot;</strong> is now live on CampusKart. Redirecting to your listing page...
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={() => router.push(`/product/${successProduct.id}`)}
            className="rounded-xl px-6 gap-2"
          >
            <span>View Listing Now</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-sm"
    >
      {/* Section 1: Product Images */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#ff4000]" />
            <span>1. Product Photos</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Clear, well-lit photos attract 3x faster campus responses.
          </p>
        </div>
        <ImageUploader
          images={images}
          onChange={(newImages) => {
            setImages(newImages);
            if (errors.images) {
              setErrors((prev) => {
                const rest = { ...prev };
                delete rest.images;
                return rest;
              });
            }
          }}
          error={errors.images}
        />
      </div>

      <div className="border-t border-neutral-100" />

      {/* Section 2: General Details */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Tag className="h-4 w-4 text-[#ff4000]" />
            <span>2. Item Details</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Tell classmates what you are selling or giving away.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Product Name */}
          <FormField
            label="Product Title"
            required
            error={errors.name}
            helperText="Include brand, edition, or model (e.g. Casio fx-991EX ClassWiz or OS Concepts 10th Ed)"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Casio fx-991EX Scientific Calculator"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20"
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            required
            error={errors.description}
            helperText="Mention how long you used it, reason for selling, whether notes/markings exist, etc."
          >
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe the condition, included accessories, purchase year, and where you can meet on campus..."
              className="w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20"
            />
          </FormField>

          {/* Category, Condition, Listing Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Category" required error={errors.category}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Condition" required error={errors.condition}>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20 cursor-pointer"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Listing Type" required>
              <select
                value={listingType}
                onChange={(e) => {
                  setListingType(e.target.value);
                  if (e.target.value === "Free") {
                    setPrice("0");
                  }
                }}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-800 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20 cursor-pointer"
              >
                {LISTING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Price Field (conditional) */}
          {listingType === "For Sale" ? (
            <FormField
              label="Price (in ₹)"
              required
              error={errors.price}
              helperText="Set a fair price. Buyers can negotiate or make counter-offers."
            >
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                  ₹
                </span>
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  placeholder="e.g. 650"
                  className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-8 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20 font-bold"
                />
              </div>
            </FormField>
          ) : listingType === "Free" ? (
            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Free Senior Giveaway
              </span>
              <span>This product will be shown with ₹0 / FREE price tag to help juniors save money.</span>
            </div>
          ) : (
            <div className="rounded-2xl bg-orange-50 p-4 border border-orange-200 text-xs text-orange-900 flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                Exchange Item
              </span>
              <span>Classmates will contact you with their items to exchange (e.g., textbook for novel).</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100" />

      {/* Section 3: Seller Contact & Campus Location */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Building className="h-4 w-4 text-[#ff4000]" />
            <span>3. Campus Meetup & Contact Details</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Used to coordinate safe hand-to-hand campus handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Your Full Name" required error={errors.sellerName}>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20"
            />
          </FormField>

          <FormField label="College Email" required error={errors.sellerEmail}>
            <input
              type="email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20"
            />
          </FormField>

          <FormField
            label="Handover Location"
            required
            helperText="e.g. Hostel Block B or Central Library"
          >
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Hostel B, SAC, or Library"
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-2 focus:ring-[#ff4000]/20"
            />
          </FormField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-neutral-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Zero platform commissions. 100% peer-to-peer.</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl flex-1 sm:flex-initial"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="rounded-xl px-8 font-bold flex-1 sm:flex-initial gap-2 shadow-md hover:shadow-lg"
          >
            <span>{isEditing ? "Save Changes" : "Post Campus Listing"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}

