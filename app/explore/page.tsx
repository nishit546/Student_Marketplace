"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductSort } from "@/components/products/ProductSort";
import { ProductFilters, FilterState } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";

function ExploreContent() {
  const searchParams = useSearchParams();
  const { products } = useProducts();

  // Initial params from URL
  const initialSearch = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialType = searchParams.get("type") || "All";
  const initialSort = searchParams.get("sort") || "newest";

  const [search, setSearch] = React.useState(initialSearch);
  const [sort, setSort] = React.useState(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const [filters, setFilters] = React.useState<FilterState>({
    category: initialCategory,
    condition: "All",
    listingType: initialType,
    minPrice: "",
    maxPrice: "",
  });

  // Keep state in sync if URL params change
  React.useEffect(() => {
    if (searchParams.get("q")) {
      setSearch(searchParams.get("q") || "");
    }
    if (searchParams.get("category")) {
      setFilters((prev) => ({
        ...prev,
        category: searchParams.get("category") || "All",
      }));
    }
    if (searchParams.get("type")) {
      setFilters((prev) => ({
        ...prev,
        listingType: searchParams.get("type") || "All",
      }));
    }
  }, [searchParams]);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setSort("newest");
    setFilters({
      category: "All",
      condition: "All",
      listingType: "All",
      minPrice: "",
      maxPrice: "",
    });
  };

  // Filter and sort items
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSeller = product.seller.name.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesSeller) {
          return false;
        }
      }

      // 2. Category
      if (filters.category && filters.category !== "All") {
        const filterCat = filters.category.toLowerCase();
        const prodCat = product.category.toLowerCase();
        // Allow fuzzy match (e.g. "Books" matches "Books & Textbooks")
        if (!prodCat.includes(filterCat) && !filterCat.includes(prodCat)) {
          return false;
        }
      }

      // 3. Condition
      if (filters.condition && filters.condition !== "All") {
        const filterCond = filters.condition.toLowerCase();
        const prodCond = product.condition.toLowerCase();
        if (filterCond === "new") {
          if (prodCond !== "new" && prodCond !== "brand new") return false;
        } else if (prodCond !== filterCond) {
          return false;
        }
      }

      // 4. Listing Type
      if (filters.listingType && filters.listingType !== "All") {
        if (
          product.listingType.toLowerCase() !== filters.listingType.toLowerCase()
        ) {
          return false;
        }
      }

      // 5. Min Price
      if (filters.minPrice !== "") {
        const min = parseFloat(filters.minPrice);
        if (!isNaN(min) && product.price < min) {
          return false;
        }
      }

      // 6. Max Price
      if (filters.maxPrice !== "") {
        const max = parseFloat(filters.maxPrice);
        if (!isNaN(max) && product.price > max) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sort === "price-asc") {
        return a.price - b.price;
      }
      if (sort === "price-desc") {
        return b.price - a.price;
      }
      // "newest" default
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [products, search, filters, sort]);

  const activeFiltersCount =
    (filters.category && filters.category !== "All" ? 1 : 0) +
    (filters.condition && filters.condition !== "All" ? 1 : 0) +
    (filters.listingType && filters.listingType !== "All" ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (search.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Explore Marketplace
              </h1>
              <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
                Browse pre-owned textbooks, calculators, dorm furniture, and electronics from campus students.
              </p>
            </div>

            {/* Quick stats */}
            <div className="text-xs font-medium text-neutral-500 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
              Showing <span className="font-semibold text-neutral-900">{filteredProducts.length}</span> of {products.length} listings
            </div>
          </div>
        </div>

        {/* Search & Sort Bar Row */}
        <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1">
            <ProductSearch value={search} onChange={setSearch} />
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            {/* Mobile Filter Trigger Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden rounded-lg border-neutral-300 bg-white text-xs font-medium gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-700" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff4000] px-1 text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Sort Dropdown */}
            <ProductSort value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Active Filter Badges Row */}
        {activeFiltersCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-neutral-500 mr-1">Active:</span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-xs text-neutral-700">
                Keyword: &quot;{search}&quot;
                <button onClick={() => setSearch("")} className="hover:text-neutral-900 cursor-pointer">×</button>
              </span>
            )}
            {filters.category && filters.category !== "All" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#fff2ee] border border-[#ff4000]/20 px-2 py-0.5 text-xs text-[#ff4000] font-medium">
                Category: {filters.category}
                <button onClick={() => setFilters({ ...filters, category: "All" })} className="font-bold cursor-pointer">×</button>
              </span>
            )}
            {filters.listingType && filters.listingType !== "All" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs text-neutral-800">
                Type: {filters.listingType}
                <button onClick={() => setFilters({ ...filters, listingType: "All" })} className="cursor-pointer">×</button>
              </span>
            )}
            {filters.condition && filters.condition !== "All" && (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs text-neutral-800">
                Condition: {filters.condition}
                <button onClick={() => setFilters({ ...filters, condition: "All" })} className="cursor-pointer">×</button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs text-neutral-800">
                ₹{filters.minPrice || "0"} - ₹{filters.maxPrice || "Any"}
                <button onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })} className="cursor-pointer">×</button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#ff4000] hover:underline ml-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* Main Content Area: Sidebar + Grid */}
        <div className="flex items-start gap-6">
          {/* Desktop Filter Sidebar */}
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            isMobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={filteredProducts}
              onResetFilters={handleResetFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff4000] border-t-transparent" />
            <p className="text-xs text-neutral-500 font-medium">Loading marketplace...</p>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
