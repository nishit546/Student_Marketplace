"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  listingType?: string;
  status?: string;
}

export function ProductGallery({
  images,
  productName,
  listingType = "For Sale",
  status = "Available",
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Fallback if no images provided
  const displayImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        ];

  const handlePrev = () => {
    setImageLoaded(false);
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setImageLoaded(false);
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const isSold = status === "Sold";

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Display */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${productName} - photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover ${
            isSold ? "grayscale opacity-60" : ""
          } ${imageLoaded ? "opacity-100" : "opacity-90"}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {listingType === "Free" && <Badge variant="free">FREE GIVEAWAY</Badge>}
          {listingType === "Exchange" && <Badge variant="exchange">FOR EXCHANGE</Badge>}
          {status === "Reserved" && <Badge variant="reserved">Reserved</Badge>}
          {status === "Available" && <Badge variant="available">Available</Badge>}
        </div>

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase">
              Item Sold
            </span>
          </div>
        )}

        {/* Navigation Arrows for Multiple Images */}
        {displayImages.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
            <button
              onClick={handlePrev}
              type="button"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-800 border border-neutral-200 hover:bg-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-neutral-800 border border-neutral-200 hover:bg-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Image Counter Pill */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row (if > 1 image) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== selectedIndex) {
                  setImageLoaded(false);
                  setSelectedIndex(idx);
                }
              }}
              type="button"
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-md border transition-colors cursor-pointer ${
                idx === selectedIndex
                  ? "border-[#ff4000] ring-1 ring-[#ff4000]"
                  : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-300"
              }`}
            >
              <Image
                src={img}
                alt={`thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
