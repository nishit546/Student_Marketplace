"use client";

import * as React from "react";
import { X, Send, CheckCircle2, MessageSquare, Mail, User } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

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
  const [submitted, setSubmitted] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
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
            className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
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
              <Button onClick={handleReset} className="rounded-xl px-6">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 py-2 pl-9 pr-3 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 py-2 pl-9 pr-3 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Message to Seller
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 p-3 text-sm text-neutral-900 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl gap-2">
                <Send className="h-4 w-4" />
                <span>Send Enquiry</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

