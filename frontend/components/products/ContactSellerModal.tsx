"use client";

import * as React from "react";
import { X, Send, CheckCircle2, MessageSquare, Mail, User, AlertCircle, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";

interface ContactSellerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactSellerModal({
  product,
  isOpen,
  onClose,
}: ContactSellerModalProps) {
  const [buyerName, setBuyerName] = React.useState("Arnav Gupta");
  const [buyerEmail, setBuyerEmail] = React.useState("arnav.gupta@college.edu");
  const [message, setMessage] = React.useState(
    `Hi ${product.seller.name.split(" ")[0]}, is this "${product.name}" still available? I would like to inspect it near ${product.location || "campus"}.`
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const isSold = product.status === "Sold";
  const productId = product.id || product._id || "";

  const validate = () => {
    const errs: Record<string, string> = {};

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

    if (!message.trim()) {
      errs.message = "Message to seller is required.";
    } else if (message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters long.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (isSold) {
      setServerError("Cannot send an enquiry for an item that is already sold.");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim().toLowerCase(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry");
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
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Contact Seller
              </h3>
              <p className="text-xs text-neutral-500">
                Message {product.seller.name} about this item
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
              Enquiry Sent Successfully!
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto leading-relaxed">
              We notified <span className="font-semibold text-neutral-900">{product.seller.name}</span> ({product.seller.email}). You can arrange a handover meetup near {product.location || "campus"}.
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

            {/* Item summary banner */}
            <div className="rounded-2xl bg-neutral-50 p-3 text-xs text-neutral-600 border border-neutral-100 flex items-center justify-between">
              <div className="truncate pr-2">
                <span className="font-semibold text-neutral-900 truncate block">
                  {product.name}
                </span>
                <span className="text-[11px] text-neutral-500">
                  Seller: {product.seller.name} ({product.seller.college})
                </span>
              </div>
              <span className="font-bold text-neutral-900 shrink-0">
                {product.listingType === "Free" ? "FREE" : `₹${product.price}`}
              </span>
            </div>

            {isSold && (
              <div className="rounded-xl bg-neutral-100 p-3 text-xs font-semibold text-neutral-700 border border-neutral-200">
                ⚠️ This item has been marked as sold. Enquiries are disabled.
              </div>
            )}

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
                Message to Seller <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                disabled={isSold || isSubmitting}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                }}
                className={`w-full rounded-xl border p-3 text-sm text-neutral-900 focus:outline-none focus:ring-1 ${
                  errors.message
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                    : "border-neutral-300 focus:border-[#ff4000] focus:ring-[#ff4000]"
                }`}
              />
              <FormErrorMessage message={errors.message} />
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Enquiry</span>
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
