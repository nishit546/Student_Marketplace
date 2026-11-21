"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Product, ListingType } from "@/types";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/sell/FormField";
import { ImageUploader } from "@/components/sell/ImageUploader";
import { useProducts } from "@/context/ProductsContext";

interface SellProductFormProps {
  initialData?: Product | null;
  initialProduct?: Product | null;
  isEditing?: boolean;
  onSuccess?: (product: Product) => void;
}

const CATEGORIES = [
  "Books & Textbooks",
  "Calculators",
  "Electronics",
  "Furniture & Dorm",
  "Stationery",
  "Lab & Engineering",
  "Sports & Cycles",
  "Other",
];

const CONDITIONS = ["Like New", "Good", "Fair", "New"];

const LISTING_TYPES: ListingType[] = ["For Sale", "Free", "Exchange"];

export function SellProductForm({
  initialData,
  initialProduct,
  isEditing = false,
  onSuccess,
}: SellProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct } = useProducts();

  const activeProduct = initialData || initialProduct || null;

  // Form State
  const [name, setName] = React.useState(activeProduct?.name || "");
  const [description, setDescription] = React.useState(
    activeProduct?.description || ""
  );
  const [price, setPrice] = React.useState(
    activeProduct?.price ? String(activeProduct.price) : ""
  );
  const [category, setCategory] = React.useState(
    activeProduct?.category || CATEGORIES[0]
  );
  const [condition, setCondition] = React.useState(
    activeProduct?.condition || "Good"
  );
  const [listingType, setListingType] = React.useState<ListingType>(
    activeProduct?.listingType || "For Sale"
  );
  const [images, setImages] = React.useState<string[]>(
    activeProduct?.images && activeProduct.images.length > 0
      ? activeProduct.images
      : []
  );

  // Seller details state
  const [sellerName, setSellerName] = React.useState(
    activeProduct?.seller?.name || "Arnav Gupta"
  );
  const [sellerEmail, setSellerEmail] = React.useState(
    activeProduct?.seller?.email || "arnav.gupta@college.edu"
  );
  const [sellerCollege, setSellerCollege] = React.useState(
    activeProduct?.seller?.college || "IIT Delhi Campus"
  );
  const [location, setLocation] = React.useState(
    activeProduct?.location || "Hostel Block B, Room 312"
  );

  // Errors & Loading
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successProduct, setSuccessProduct] = React.useState<Product | null>(
    null
  );

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Title is required";
    else if (name.trim().length < 3) errs.name = "Title must be at least 3 characters";

    if (!description.trim()) errs.description = "Description is required";
    else if (description.trim().length < 10)
      errs.description = "Provide at least 10 characters describing the item";

    if (listingType === "For Sale") {
      const numPrice = Number(price);
      if (!price || isNaN(numPrice) || numPrice <= 0) {
        errs.price = "Enter a valid price greater than 0";
      }
    }

    if (!images || images.length === 0) {
      errs.images = "At least one product photo is required";
    }

    if (!sellerName.trim()) errs.sellerName = "Seller name is required";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!sellerEmail.trim() || !emailRegex.test(sellerEmail.trim())) {
      errs.sellerEmail = "Valid email is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const productPayload = {
      name: name.trim(),
      description: description.trim(),
      price: listingType === "Free" ? 0 : Number(price) || 0,
      category,
      condition,
      listingType,
      images:
        images.length > 0
          ? images
          : [
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
            ],
      location: location.trim(),
      seller: {
        name: sellerName.trim(),
        email: sellerEmail.trim().toLowerCase(),
        college: sellerCollege.trim(),
        year: initialData?.seller?.year || "3rd Year B.Tech",
      },
    };

    if (isEditing && activeProduct) {
      const targetId = activeProduct.id || activeProduct._id || "";
      const success = await updateProduct(targetId, productPayload);
      setIsSubmitting(false);
      if (success) {
        const mergedProduct: Product = {
          ...activeProduct,
          ...productPayload,
          id: targetId,
          _id: targetId,
          updatedAt: new Date().toISOString(),
        };
        if (onSuccess) onSuccess(mergedProduct);
        else router.push(`/product/${targetId}`);
      }
    } else {
      const newProduct = await addProduct(productPayload);
      setIsSubmitting(false);
      if (newProduct) {
        setSuccessProduct(newProduct);
        if (onSuccess) onSuccess(newProduct);
        setTimeout(() => {
          router.push(`/product/${newProduct.id || newProduct._id}`);
        }, 1200);
      }
    }
  };

  if (successProduct) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 sm:p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Listing Published
        </h2>
        <p className="mt-1.5 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
          Your product <strong className="text-neutral-900">&quot;{successProduct.name}&quot;</strong> is now live on CampusKart. Redirecting to your listing page...
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            onClick={() => router.push(`/product/${successProduct.id}`)}
            className="rounded-lg px-5 gap-2 font-medium"
          >
            <span>View Listing</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8"
    >
      {/* Section 1: Product Images */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-neutral-900">
            1. Product Photos
          </h2>
          <p className="text-xs text-neutral-500">
            Clear, well-lit photos help campus buyers inspect condition.
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
        <div className="mb-3">
          <h2 className="text-sm font-bold text-neutral-900">
            2. Item Details
          </h2>
          <p className="text-xs text-neutral-500">
            Provide details about what you are selling or giving away.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Product Name */}
          <FormField
            label="Product Title"
            required
            error={errors.name}
            helperText="Include model or edition (e.g. Casio fx-991EX or OS Concepts 10th Ed)"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Casio fx-991EX Scientific Calculator"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            required
            error={errors.description}
            helperText="Mention how long you used it, condition notes, included accessories, etc."
          >
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe condition, accessories, and where on campus you can meet..."
              className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </FormField>

          {/* Category, Condition, Listing Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Category" required error={errors.category}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000] cursor-pointer"
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
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000] cursor-pointer"
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
                  setListingType(e.target.value as ListingType);
                  if (e.target.value === "Free") {
                    setPrice("0");
                  }
                }}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000] cursor-pointer"
              >
                {LISTING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Price Field */}
          {listingType === "For Sale" ? (
            <FormField
              label="Price (in ₹)"
              required
              error={errors.price}
              helperText="Set a fair price. Buyers can negotiate or make counter-offers."
            >
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
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
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-8 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000] font-semibold"
                />
              </div>
            </FormField>
          ) : listingType === "Free" ? (
            <div className="rounded-lg bg-emerald-50 p-3.5 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                Free Giveaway
              </span>
              <span>This product will be listed with a ₹0 / FREE price tag.</span>
            </div>
          ) : (
            <div className="rounded-lg bg-orange-50 p-3.5 border border-orange-200 text-xs text-orange-900 flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                Exchange Item
              </span>
              <span>Classmates will contact you with their items to exchange.</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100" />

      {/* Section 3: Seller Contact & Campus Location */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-neutral-900">
            3. Campus Location & Contact Details
          </h2>
          <p className="text-xs text-neutral-500">
            Used to coordinate campus meetups and handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Your Full Name" required error={errors.sellerName}>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </FormField>

          <FormField label="College Email" required error={errors.sellerEmail}>
            <input
              type="email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </FormField>

          <FormField label="College / Campus" required>
            <input
              type="text"
              value={sellerCollege}
              onChange={(e) => setSellerCollege(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </FormField>
        </div>

        <div className="mt-3">
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
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </FormField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-neutral-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Zero platform commissions. 100% peer-to-peer.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-lg flex-1 sm:flex-initial"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="default"
            className="rounded-lg px-6 font-medium flex-1 sm:flex-initial gap-2"
          >
            <span>{isEditing ? "Save Changes" : "Post Listing"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
