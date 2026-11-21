"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";

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
  onToggle,
  showLabel = false,
  size = "default",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = await toggleFavorite(productId);
    if (onToggle) {
      onToggle(nextSaved);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs gap-1.5",
    default: "h-10 px-4 text-sm gap-2",
    lg: "h-11 px-5 text-sm gap-2",
  }[size];

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium transition-colors cursor-pointer",
        saved
          ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400",
        sizeClasses,
        className
      )}
      title={saved ? "Remove from favorites" : "Save to favorites"}
      aria-label="Toggle favorite"
    >
      <Heart
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-4 w-4" : "h-4 w-4",
          saved
            ? "fill-current text-rose-600"
            : "text-neutral-500"
        )}
      />
      {showLabel && (
        <span>{saved ? "Saved in Favorites" : "Save to Favorites"}</span>
      )}
    </button>
  );
}
