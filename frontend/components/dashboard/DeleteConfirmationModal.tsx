"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => void;
}

export function DeleteConfirmationModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !product) return null;

  const productId = product.id || product._id || "";

  const handleConfirm = () => {
    onConfirm(productId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-rose-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Delete Listing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Are you sure you want to permanently remove{" "}
            <strong className="text-neutral-900">&quot;{product.name}&quot;</strong>?
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            This listing will immediately be removed from campus search and your active dashboard.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="rounded-lg font-medium"
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
