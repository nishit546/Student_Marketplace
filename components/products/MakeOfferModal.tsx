"use client";

import * as React from "react";
import { X, Tag, CheckCircle2, User, Mail, AlertCircle, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";

interface MakeOfferModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function MakeOfferModal({
  product,
  isOpen,
  onClose,
}: MakeOfferModalProps) {
  // Suggest default offer at ~85% of asking price rounded to tens
  const defaultOffer =
    product.price > 0 ? Math.round((product.price * 0.85) / 10) * 10 : 0;

  const [offeredPrice, setOfferedPrice] = React.useState<number | string>(
    defaultOffer || ""
  );
  const [buyerName, setBuyerName] = React.useState("Arnav Gupta");
  const [buyerEmail, setBuyerEmail] = React.useState("arnav.gupta@college.edu");
  const [note, setNote] = React.useState(
    "Can pick up today from campus hostel and pay immediately via UPI."
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const isSold = product.status === "Sold";
  const isForSale = product.listingType === "For Sale";
  const productId = product.id || product._id || "";

  const validate = () => {
    const errs: Record<string, string> = {};

    const priceNum = Number(offeredPrice);
    if (!offeredPrice || isNaN(priceNum) || priceNum <= 0) {
      errs.offeredPrice = "Please enter a valid positive price in ₹.";
    } else if (priceNum > product.price) {
      errs.offeredPrice = `Your offer cannot exceed the original asking price of ₹${product.price}.`;
    }

    if (!buyerName.trim()) {
      errs.buyerName = "Your name is required.";
    } else if (buyerName.trim().length < 2) {
      errs.buyerName = "Name must be at least 2 characters.";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!buyerEmail.trim()) {
      errs.buyerEmail = "College email is required.";
    } else if (!emailRegex.test(buyerEmail.trim())) {
      errs.buyerEmail = "Please enter a valid email address.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (isSold) {
      setServerError("Cannot make an offer on a sold item.");
      return;
    }

    if (!isForSale) {
      setServerError(`Price offers are only allowed for items listed 'For Sale'. This item is '${product.listingType}'.`);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim().toLowerCase(),
          offeredPrice: Number(offeredPrice),
          message: note.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit price offer");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error, please try again.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setServerError(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={handleReset}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff2ee] text-[#ff4000]">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Make an Offer
              </h3>
              <p className="text-xs text-neutral-500">
                Negotiate price directly with {product.seller.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4 animate-in zoom-in">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900">
              Offer of ₹{offeredPrice} Submitted!
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
              Your counter-offer has been sent to{" "}
              <span className="font-semibold text-neutral-900">
                {product.seller.name}
              </span>{" "}
              ({product.seller.email}). They can review and accept it from their seller dashboard.
            </p>
            <div className="mt-6">
              <Button onClick={handleReset} className="rounded-xl px-6 font-bold">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {serverError && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Price comparison row */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-neutral-50 p-3.5 border border-neutral-100 text-center">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block">
                  Original Price
                </span>
                <span className="text-base font-black text-neutral-700">
                  {product.listingType === "Free" ? "FREE" : `₹${product.price}`}
                </span>
              </div>
              <div className="border-l border-neutral-200">
                <span className="text-[11px] font-semibold text-[#ff4000] block">
                  Your Offer (₹)
                </span>
                <span className="text-base font-black text-[#ff4000]">
                  {offeredPrice ? `₹${offeredPrice}` : "—"}
                </span>
              </div>
            </div>

            {isSold && (
              <div className="rounded-xl bg-neutral-100 p-3 text-xs font-semibold text-neutral-700 border border-neutral-200">
                ⚠️ This item has been sold. Price offers are disabled.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Price Offer in ₹ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                  ₹
                </span>
                <input
                  type="number"
                  disabled={isSold || isSubmitting}
                  min={1}
                  max={product.price}
                  value={offeredPrice}
                  onChange={(e) => {
                    setOfferedPrice(e.target.value);
                    if (errors.offeredPrice) setErrors((prev) => ({ ...prev, offeredPrice: "" }));
                  }}
                  placeholder="Enter your price offer"
                  className={`w-full rounded-xl border py-2 pl-8 pr-3 text-sm text-neutral-900 focus:outline-none focus:ring-1 ${
                    errors.offeredPrice
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                      : "border-neutral-300 focus:border-[#ff4000] focus:ring-[#ff4000]"
                  }`}
                />
              </div>
              <FormErrorMessage message={errors.offeredPrice} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  disabled={isSold || isSubmitting}
                  value={buyerName}
                  onChange={(e) => {
                    setBuyerName(e.target.value);
                    if (errors.buyerName) setErrors((prev) => ({ ...prev, buyerName: "" }));
                  }}
                  className={`w-full rounded-xl border py-2 pl-9 pr-3 text-sm text-neutral-900 focus:outline-none focus:ring-1 ${
                    errors.buyerName
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                      : "border-neutral-300 focus:border-[#ff4000] focus:ring-[#ff4000]"
                  }`}
                />
              </div>
              <FormErrorMessage message={errors.buyerName} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your College Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  disabled={isSold || isSubmitting}
                  value={buyerEmail}
                  onChange={(e) => {
                    setBuyerEmail(e.target.value);
                    if (errors.buyerEmail) setErrors((prev) => ({ ...prev, buyerEmail: "" }));
                  }}
                  className={`w-full rounded-xl border py-2 pl-9 pr-3 text-sm text-neutral-900 focus:outline-none focus:ring-1 ${
                    errors.buyerEmail
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                      : "border-neutral-300 focus:border-[#ff4000] focus:ring-[#ff4000]"
                  }`}
                />
              </div>
              <FormErrorMessage message={errors.buyerEmail} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Note to Seller (Optional)
              </label>
              <textarea
                rows={2}
                disabled={isSold || isSubmitting}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 p-3 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleReset}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSold || isSubmitting}
                className="rounded-xl gap-2 font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Tag className="h-4 w-4" />
                    <span>Submit Offer</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
