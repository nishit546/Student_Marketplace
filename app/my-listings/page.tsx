"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  CheckCircle2,
  Tag,
  Search,
  Sparkles,
} from "lucide-react";
import { useProducts, DEMO_USER } from "@/context/ProductsContext";
import { Product } from "@/types";
import { MyListingCard } from "@/components/dashboard/MyListingCard";
import { EditProductModal } from "@/components/dashboard/EditProductModal";
import { DeleteConfirmationModal } from "@/components/dashboard/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";

export default function MyListingsPage() {
  const { myListings, deleteProduct, updateProduct, isLoaded } = useProducts();

  const [activeTab, setActiveTab] = React.useState<"all" | "active" | "sold">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals state
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);

  // Statistics
  const totalCount = myListings.length;
  const activeCount = myListings.filter((p) => p.status !== "Sold").length;
  const soldCount = myListings.filter((p) => p.status === "Sold").length;

  // Filter listings
  const filteredListings = React.useMemo(() => {
    return myListings.filter((p) => {
      // Tab filter
      if (activeTab === "active" && p.status === "Sold") return false;
      if (activeTab === "sold" && p.status !== "Sold") return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [myListings, activeTab, searchQuery]);

  const handleToggleSold = (product: Product) => {
    const pId = product.id || product._id || "";
    const nextStatus = product.status === "Sold" ? "Available" : "Sold";
    updateProduct(pId, { status: nextStatus });
  };

  const handleDeleteConfirm = (productId: string) => {
    deleteProduct(productId);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff4000] border-t-transparent" />
          <p className="text-xs text-neutral-500 font-medium">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2ee] px-3.5 py-1 text-xs font-bold text-[#ff4000] border border-[#ff4000]/20 mb-2">
              <Package className="h-3.5 w-3.5" />
              <span>Seller Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              My Campus Listings
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage your published second-hand items, edit prices, mark items sold, or remove listings.
            </p>
          </div>

          <Link href="/sell">
            <Button className="rounded-xl px-5 font-bold gap-2 shadow-sm hover:shadow">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Listing</span>
            </Button>
          </Link>
        </div>

        {/* Demo Seller Identity Notice */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-4 border border-neutral-200/80 shadow-sm text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4000] text-white font-bold text-sm">
              {DEMO_USER.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-neutral-900 text-sm">{DEMO_USER.name}</div>
              <div className="text-neutral-500">{DEMO_USER.email} • {DEMO_USER.college}</div>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Active Campus Demo Seller</span>
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-semibold">Total Listings</span>
              <Package className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">
              {totalCount}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-semibold">Active & Live</span>
              <Tag className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {activeCount}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-semibold">Sold Items</span>
              <CheckCircle2 className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-700">
              {soldCount}
            </div>
          </div>
        </div>

        {/* Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl bg-white p-1 border border-neutral-200/90 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-[#ff4000] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "active"
                  ? "bg-[#ff4000] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("sold")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "sold"
                  ? "bg-[#ff4000] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Sold ({soldCount})
            </button>
          </div>

          {/* Search query in user listings */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search your listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white py-1.5 pl-8 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </div>
        </div>

        {/* Listings List */}
        {filteredListings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2ee] text-[#ff4000] mb-4">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              No listings found
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? "No listings match your search query. Try typing a different keyword."
                : activeTab === "sold"
                ? "You have not marked any listings as sold yet."
                : "You haven’t listed any campus items yet. Post your textbooks or gadgets in 2 minutes."}
            </p>
            <div className="mt-6">
              <Link href="/sell">
                <Button className="rounded-xl px-6 gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create First Listing</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredListings.map((product) => (
              <MyListingCard
                key={product.id || product._id}
                product={product}
                onEdit={(p) => setEditingProduct(p)}
                onDelete={(p) => setDeletingProduct(p)}
                onToggleSold={handleToggleSold}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Listing Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

