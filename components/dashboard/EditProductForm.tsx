"use client";

import * as React from "react";
import { Product } from "@/types";
import { SellProductForm } from "@/components/sell/SellProductForm";

interface EditProductFormProps {
  product: Product;
  onSuccess?: (updated: Product) => void;
  onCancel?: () => void;
}

export function EditProductForm({
  product,
  onSuccess,
  onCancel,
}: EditProductFormProps) {
  return (
    <div className="w-full">
      <SellProductForm
        initialProduct={product}
        isEditing={true}
        onSuccess={onSuccess}
      />
    </div>
  );
}

