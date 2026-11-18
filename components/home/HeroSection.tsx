"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  const popularSearches = [
    "Casio fx-991EX",
    "Operating Systems",
    "Hostel Study Table",
    "Lab Coat",
    "Mini Drafter",
    "Bluetooth Headphones",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff7f4] via-[#ffffff] to-[#fafafa] pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-neutral-200/60">
      {/* Subtle decorative background circles */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-[#ff4000]/5 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-80 w-80 rounded-full bg-[#ff4000]/8 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#ff4000] shadow-sm border border-[#ff4000]/20 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#ff4000]" />
            <span>Exclusively Built for University & College Students</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl leading-[1.12]">
            Buy & Sell Pre-Loved Gear{" "}
            <span className="text-[#ff4000] underline decoration-[#ff4000]/30 decoration-wavy underline-offset-8">
              On Campus
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Find textbooks, scientific calculators, dorm furniture, electronics, and senior giveaways.
            Hand-to-hand transactions right on campus — zero shipping fees, zero middlemen.
          </p>

          {/* Prominent Search Bar Form */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row items-stretch gap-2.5 rounded-2xl bg-white p-2.5 shadow-lg shadow-neutral-200/50 border border-neutral-300/80 max-w-2xl mx-auto focus-within:border-[#ff4000] focus-within:ring-2 focus-within:ring-[#ff4000]/20 transition-all"
          >
            <div className="relative flex flex-1 items-center pl-3">
              <Search className="h-5 w-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, calculators, monitors, dorm desks..."
                className="w-full border-none bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="h-12 rounded-xl px-7 text-sm font-semibold shadow-sm hover:shadow"
            >
              <span>Search Market</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Popular Tag Quick Links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500">
            <span className="font-medium text-neutral-600 mr-1">Trending:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/explore?q=${encodeURIComponent(term)}`)}
                type="button"
                className="rounded-full bg-white px-3 py-1 text-neutral-600 border border-neutral-200 hover:border-[#ff4000] hover:text-[#ff4000] hover:bg-[#fff7f4] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Key Value Points */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-neutral-200/70 pt-8 max-w-xl mx-auto text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-neutral-900">₹0</div>
              <div className="text-xs text-neutral-500 font-medium mt-0.5">Commission Fees</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#ff4000]">5 Mins</div>
              <div className="text-xs text-neutral-500 font-medium mt-0.5">Average Campus Meetup</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-neutral-900">100%</div>
              <div className="text-xs text-neutral-500 font-medium mt-0.5">Peer Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

