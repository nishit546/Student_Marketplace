"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Plus, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

const QUICK_CAMPUS_PRESETS = [
  {
    label: "Calculators",
    url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Textbook",
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Electronics",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Room Desk",
    url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Stationery",
    url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
  },
];

export function ImageUploader({ images, onChange, error }: ImageUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate image type
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange([...images, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be picked again if desired
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      onChange([...images, url]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
          error
            ? "border-rose-300 bg-rose-50/30"
            : "border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-neutral-100/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-neutral-200 text-[#ff4000] mb-2.5">
          <UploadCloud className="h-5 w-5" />
        </div>

        <p className="text-sm font-semibold text-neutral-800">
          Upload product photos
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          PNG, JPG, WEBP up to 5MB (at least 1 photo required)
        </p>
      </div>

      {/* Quick preset chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-medium text-neutral-500">
          Sample images:
        </span>
        {QUICK_CAMPUS_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handleAddPreset(preset.url)}
            className="rounded-md bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700 transition-colors cursor-pointer"
          >
            + {preset.label}
          </button>
        ))}
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-semibold text-neutral-600 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
              <span>Selected Images ({images.length})</span>
            </span>
            <span className="text-[11px] text-neutral-400">First image is the card cover</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100"
              >
                <Image
                  src={img}
                  alt={`Upload preview ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />

                {/* Primary cover indicator */}
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase">
                    Cover
                  </span>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 mb-0.5" />
              <span className="text-[10px] font-medium">Add more</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
