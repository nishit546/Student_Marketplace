"use client";

import * as React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-rose-600">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Delete Listing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
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
            This action will remove the item from the explore marketplace and your seller dashboard.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="rounded-xl gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Listing</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

