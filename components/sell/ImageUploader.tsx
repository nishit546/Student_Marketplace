"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Plus, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
          error
            ? "border-rose-400 bg-rose-50/40"
            : "border-neutral-300 hover:border-[#ff4000] bg-neutral-50 hover:bg-[#fff9f7]"
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

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-neutral-200 text-[#ff4000] shadow-sm group-hover:scale-105 transition-transform mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-bold text-neutral-800">
          Click to upload product photos
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          PNG, JPG, WEBP up to 5MB (at least 1 photo required)
        </p>
      </div>

      {/* Quick preset chips for rapid testing */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
          <Sparkles className="h-3 w-3 text-[#ff4000]" />
          <span>Quick sample photos:</span>
        </span>
        {QUICK_CAMPUS_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => handleAddPreset(preset.url)}
            className="rounded-lg bg-neutral-100 hover:bg-[#fff2ee] hover:text-[#ff4000] border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700 transition-colors"
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
            <span className="text-[11px] text-neutral-400">First image will be the card cover</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm"
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
                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase backdrop-blur-sm">
                    Cover
                  </span>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white shadow hover:bg-rose-600 transition-colors"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-white text-neutral-500 hover:border-[#ff4000] hover:text-[#ff4000] transition-colors"
            >
              <Plus className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold">Add more</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-rose-500 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}

