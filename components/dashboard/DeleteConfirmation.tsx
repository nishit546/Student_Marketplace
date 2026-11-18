"use client";

import * as React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
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
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-md text-left">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Delete Campus Listing
          </h3>
          <p className="text-xs text-neutral-500">
            This action cannot be undone
          </p>
        </div>
      </div>

      <p className="text-sm text-neutral-600 leading-relaxed mb-6">
        Are you sure you want to delete{" "}
        <strong className="text-neutral-900">&quot;{product.name}&quot;</strong>? It will immediately be removed from the marketplace and your active listings.
      </p>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
          className="rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onConfirm(productId)}
          disabled={isDeleting}
          className="rounded-xl gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
        </Button>
      </div>
    </div>
  );
}

