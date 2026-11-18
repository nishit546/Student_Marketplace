"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  initialSaved?: boolean;
  onToggle?: (saved: boolean) => void;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function FavoriteButton({
  productId,
  initialSaved = false,
  onToggle,
  showLabel = false,
  size = "default",
  className,
}: FavoriteButtonProps) {
  const [saved, setSaved] = React.useState(initialSaved);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = !saved;
    setSaved(nextSaved);
    if (onToggle) {
      onToggle(nextSaved);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs gap-1.5",
    default: "h-11 px-4 text-sm gap-2",
    lg: "h-12 px-5 text-base gap-2.5",
  }[size];

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-xl border font-semibold transition-all duration-200 active:scale-95",
        saved
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300",
        sizeClasses,
        className
      )}
      title={saved ? "Remove from favorites" : "Save to favorites"}
      aria-label="Toggle favorite"
    >
      <Heart
        className={cn(
          "transition-all duration-200",
          size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
          saved ? "fill-current text-rose-500 scale-110" : "text-neutral-500"
        )}
      />
      {showLabel && (
        <span>{saved ? "Saved to Favorites" : "Add to Favorites"}</span>
      )}
    </button>
  );
}

