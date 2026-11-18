"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  Tag,
  ArrowLeft,
  Share2,
  Check,
  Building,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Product } from "@/types";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { FavoriteButton } from "@/components/products/FavoriteButton";
import { ContactSellerModal } from "@/components/products/ContactSellerModal";
import { MakeOfferModal } from "@/components/products/MakeOfferModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatTimeAgo } from "@/lib/utils";

interface ProductDetailsViewProps {
  product: Product;
  similarProducts: Product[];
}

export function ProductDetailsView({
  product,
  similarProducts,
}: ProductDetailsViewProps) {
  const [contactModalOpen, setContactModalOpen] = React.useState(false);
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const productId = product.id || product._id || "";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSold = product.status === "Sold";
  const isFree = product.listingType === "Free";

  return (
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 font-semibold text-neutral-600 hover:text-[#ff4000] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <Link
              href={`/explore?category=${encodeURIComponent(product.category)}`}
              className="hover:text-neutral-800 transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="truncate max-w-[200px] sm:max-w-xs text-neutral-800 font-medium">
              {product.name}
            </span>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Item</span>
              </>
            )}
          </button>
        </div>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mb-16">
          {/* Left Column: Image Gallery & Detailed Specs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ProductGallery
              images={product.images}
              productName={product.name}
              listingType={product.listingType}
              status={product.status}
            />

            {/* Description Card */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#ff4000]" />
                <span>Product Description</span>
              </h2>
              <div className="prose prose-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>

              {/* Condition Details Table */}
              <div className="mt-6 pt-5 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block font-medium">Condition</span>
                  <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">
                    {product.condition}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Listing Type</span>
                  <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">
                    {product.listingType}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Availability</span>
                  <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">
                    {product.status}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Pickup Location</span>
                  <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">
                    {product.location || "Campus Premises"}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Listed On</span>
                  <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">
                    {formatTimeAgo(product.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Verified College</span>
                  <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">
                    Yes (Student ID)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Primary CTAs & Seller Information (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Purchase & Action Box */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-sm">
              {/* Category & Status pill */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="secondary" className="font-medium text-xs">
                  {product.category}
                </Badge>
                {product.status === "Available" ? (
                  <Badge variant="available">Available</Badge>
                ) : product.status === "Reserved" ? (
                  <Badge variant="reserved">Reserved</Badge>
                ) : (
                  <Badge variant="sold">Sold</Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="mt-4 flex items-baseline gap-3 rounded-2xl bg-[#fff7f4] p-4 border border-[#ff4000]/15">
                <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  isFree ? "text-emerald-600" : "text-[#ff4000]"
                }`}>
                  {formatPrice(product.price, product.listingType)}
                </span>
                {product.listingType === "For Sale" && (
                  <span className="text-xs font-semibold text-neutral-500">
                    Negotiable on campus handover
                  </span>
                )}
              </div>

              {/* Interactive Action Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                {/* Contact Seller Button */}
                <Button
                  onClick={() => setContactModalOpen(true)}
                  disabled={isSold}
                  size="lg"
                  className="w-full justify-center gap-2 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{isSold ? "Item Already Sold" : "Contact Seller"}</span>
                </Button>

                {/* Secondary Row: Make an Offer + Favorite */}
                <div className="flex items-center gap-2.5">
                  {!isFree && (
                    <Button
                      onClick={() => setOfferModalOpen(true)}
                      disabled={isSold}
                      variant="outline"
                      size="lg"
                      className="flex-1 justify-center gap-2 rounded-xl border-neutral-300 font-semibold text-neutral-800 hover:border-[#ff4000] hover:text-[#ff4000]"
                    >
                      <Tag className="h-4 w-4" />
                      <span>Make an Offer</span>
                    </Button>
                  )}

                  <FavoriteButton
                    productId={productId}
                    showLabel
                    size="lg"
                    className={isFree ? "w-full justify-center" : "flex-1 justify-center"}
                  />
                </div>
              </div>

              {/* Campus Meetup Tag */}
              <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
                <MapPin className="h-4 w-4 text-[#ff4000] shrink-0" />
                <span>
                  Meetup: <strong className="text-neutral-800">{product.location || product.seller.college}</strong>
                </span>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Seller Information
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Student ID Verified</span>
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff4000] text-white font-bold text-lg shadow-sm">
                  {product.seller.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 leading-snug">
                    {product.seller.name}
                  </h4>
                  <p className="text-xs text-neutral-500">{product.seller.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50 rounded-2xl p-3.5 border border-neutral-100">
                {product.seller.college && (
                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>{product.seller.college}</span>
                  </div>
                )}
                {product.seller.year && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>{product.seller.year}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span>Usually responds in &lt; 30 minutes</span>
                </div>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="rounded-3xl border border-neutral-200/90 bg-[#fffdfc] p-6 text-xs text-neutral-600 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Safe Campus Meetup Guidelines</span>
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-neutral-500 leading-relaxed">
                <li>Meet in public campus areas (SAC, Library, or Canteen).</li>
                <li>Physically test and inspect the item before paying.</li>
                <li>Make payment directly using UPI only on physical handover.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="pt-10 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Similar Items on Campus
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  More listings under {product.category}
                </p>
              </div>
              <Link
                href={`/explore?category=${encodeURIComponent(product.category)}`}
                className="text-xs sm:text-sm font-semibold text-[#ff4000] hover:underline"
              >
                View all in {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <ContactSellerModal
        product={product}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <MakeOfferModal
        product={product}
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
      />
    </div>
  );
}

