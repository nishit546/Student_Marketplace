"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  CheckCircle2,
  Tag,
  Search,
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
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ff4000] border-t-transparent" />
          <p className="text-xs text-neutral-500 font-medium">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              My Listings
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage your published items, update prices, or mark items as sold.
            </p>
          </div>

          <Link href="/sell">
            <Button className="rounded-lg px-4 font-medium gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Create Listing</span>
            </Button>
          </Link>
        </div>

        {/* Seller Identity Notice */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-3.5 border border-neutral-200 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 font-bold text-sm">
              {DEMO_USER.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-neutral-900 text-sm">{DEMO_USER.name}</div>
              <div className="text-neutral-500">{DEMO_USER.email} • {DEMO_USER.college}</div>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
            Student Account
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">Total Listings</span>
              <Package className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {totalCount}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">Active</span>
              <Tag className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {activeCount}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-500 mb-1">
              <span className="text-xs font-medium">Sold</span>
              <CheckCircle2 className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">
              {soldCount}
            </div>
          </div>
        </div>

        {/* Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-1 w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "active"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("sold")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "sold"
                  ? "bg-white text-neutral-900 shadow-xs"
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
              className="w-full rounded-lg border border-neutral-300 bg-white py-1.5 pl-8 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
            />
          </div>
        </div>

        {/* Listings List */}
        {filteredListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 mb-3">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              No listings found
            </h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? "No listings match your search query."
                : activeTab === "sold"
                ? "You have not marked any listings as sold yet."
                : "You have not listed any items yet."}
            </p>
            {!searchQuery && activeTab !== "sold" && (
              <div className="mt-5">
                <Link href="/sell">
                  <Button size="sm" className="rounded-lg font-medium">
                    List Your First Item
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
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

      {/* Edit Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        product={deletingProduct}
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
