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
  listingType,
  status,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const isSold = status === "Sold";

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Display */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-100 shadow-sm">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${productName} - photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-300 ${
            isSold ? "grayscale opacity-60" : ""
          } ${imageLoaded ? "opacity-100" : "opacity-90"}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
          {listingType === "Free" && <Badge variant="free">FREE GIVEAWAY</Badge>}
          {listingType === "Exchange" && <Badge variant="exchange">FOR EXCHANGE</Badge>}
          {status === "Reserved" && <Badge variant="reserved">Reserved</Badge>}
          {status === "Available" && <Badge variant="available">Available on Campus</Badge>}
        </div>

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <span className="rounded-xl bg-neutral-900/90 px-5 py-2 text-sm font-bold tracking-wider text-white uppercase border border-white/20">
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
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Image Counter Pill */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              type="button"
              className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                selectedIndex === idx
                  ? "border-[#ff4000] ring-2 ring-[#ff4000]/20 scale-102"
                  : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumb ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

