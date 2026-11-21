"use client";

import * as React from "react";
import { X, Edit3 } from "lucide-react";
import { Product } from "@/types";
import { SellProductForm } from "@/components/sell/SellProductForm";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: Product) => void;
}

export function EditProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  if (!isOpen || !product) return null;

  const handleSuccess = (updated: Product) => {
    if (onSuccess) onSuccess(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative my-8 w-full max-w-3xl rounded-xl bg-white p-5 sm:p-6 shadow-lg border border-neutral-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff2ee] text-[#ff4000]">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Edit Listing
              </h3>
              <p className="text-xs text-neutral-500">
                Update details for &quot;{product.name}&quot;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SellProductForm
          initialData={product}
          isEditing={true}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
