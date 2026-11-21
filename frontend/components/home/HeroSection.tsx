"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
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
    "Headphones",
  ];

  return (
    <section className="bg-white border-b border-neutral-200 pt-12 pb-14 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tag */}
          <div className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 mb-5">
            Student Marketplace
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl leading-tight">
            Buy and sell pre-owned gear on campus
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Textbooks, calculators, electronics, and hostel essentials from students around you.
            Meet directly on campus with zero shipping costs.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-7 flex flex-col sm:flex-row items-stretch gap-2 rounded-lg bg-white p-1.5 border border-neutral-300 max-w-xl mx-auto focus-within:border-neutral-900 transition-colors"
          >
            <div className="relative flex flex-1 items-center pl-2.5">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, calculators, dorm furniture..."
                className="w-full border-none bg-transparent px-2.5 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="h-9 rounded-md px-5 text-sm font-medium"
            >
              <span>Search</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Popular Tag Quick Links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500">
            <span className="font-medium text-neutral-600 mr-1">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/explore?q=${encodeURIComponent(term)}`)}
                type="button"
                className="rounded-md bg-neutral-100 px-2 py-0.5 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Key Points */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6 max-w-md mx-auto text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-neutral-900">₹0</div>
              <div className="text-xs text-neutral-500 mt-0.5">Platform Fees</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-neutral-900">Direct</div>
              <div className="text-xs text-neutral-500 mt-0.5">Campus Meetup</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-neutral-900">Verified</div>
              <div className="text-xs text-neutral-500 mt-0.5">Student Community</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
