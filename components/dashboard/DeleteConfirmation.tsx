"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
  product: Product;
  onConfirm: (productId: string) => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmation({
  product,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationProps) {
  const productId = product.id || product._id || "";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 text-left">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <AlertTriangle className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Delete Listing
          </h3>
          <p className="text-xs text-neutral-500">
            This action cannot be undone
          </p>
        </div>
      </div>

      <p className="text-sm text-neutral-600 leading-relaxed mb-6">
        Are you sure you want to delete{" "}
        <strong className="text-neutral-900">&quot;{product.name}&quot;</strong>? It will immediately be removed from the marketplace.
      </p>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
          className="rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onConfirm(productId)}
          disabled={isDeleting}
          className="rounded-lg font-medium"
        >
          {isDeleting ? "Deleting..." : "Delete Listing"}
        </Button>
      </div>
    </div>
  );
}
