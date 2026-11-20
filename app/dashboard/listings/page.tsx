"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Search,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts, DEMO_USER } from "@/context/ProductsContext";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { Product } from "@/types";
import { EditProductModal } from "@/components/dashboard/EditProductModal";
import { DeleteConfirmationModal } from "@/components/dashboard/DeleteConfirmationModal";

export default function DashboardListings() {
  const { products, updateProduct, deleteProduct, isLoaded, refreshProducts } = useProducts();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [sort, setSort] = React.useState("newest");
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);

  const myListings = React.useMemo(() => {
    return products.filter(
      (p) =>
        p.seller.email === DEMO_USER.email ||
        p.seller.name.toLowerCase() === DEMO_USER.name.toLowerCase()
    );
  }, [products]);

  const filtered = React.useMemo(() => {
    let list = [...myListings];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [myListings, search, statusFilter, sort]);

  const handleToggleSold = async (product: Product) => {
    const pId = product.id || product._id || "";
    const next = product.status === "Sold" ? "Available" : "Sold";
    await updateProduct(pId, { status: next });
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
    setDeletingProduct(null);
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    refreshProducts();
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ff4000]" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2ee] px-3.5 py-1 text-xs font-bold text-[#ff4000] border border-[#ff4000]/20 mb-2">
            <Package className="h-3.5 w-3.5" />
            <span>Listings Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            My Listings
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {myListings.length} {myListings.length === 1 ? "product" : "products"} listed
          </p>
        </div>
        <Link href="/sell">
          <Button className="rounded-xl px-5 font-bold gap-2 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            <span>New Listing</span>
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#ff4000] focus:outline-none focus:ring-1 focus:ring-[#ff4000]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-[#ff4000] focus:outline-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Reserved">Reserved</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-[#ff4000] focus:outline-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Listing Table/Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="font-bold text-neutral-900">No listings found</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {search || statusFilter !== "All"
              ? "Try adjusting your search or filters."
              : "You haven't created any listings yet."}
          </p>
          <Link href="/sell">
            <Button className="mt-4 rounded-xl gap-2 font-semibold">
              <PlusCircle className="h-4 w-4" />
              <span>Create Listing</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => {
            const pId = product.id || product._id || "";
            const isSold = product.status === "Sold";
            return (
              <div
                key={pId}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-sm ${
                  isSold ? "border-neutral-100 opacity-75" : "border-neutral-200/80"
                }`}
              >
                {/* Image */}
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                  <Image
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=80&q=60"}
                    alt={product.name}
                    fill
                    className={`object-cover ${isSold ? "grayscale" : ""}`}
                    sizes="64px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">{product.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-500">
                    <span className="font-bold text-neutral-800">
                      {formatPrice(product.price, product.listingType)}
                    </span>
                    <span>·</span>
                    <span>{product.category}</span>
                    <span>·</span>
                    <span>{product.condition}</span>
                    <span>·</span>
                    <span>{formatTimeAgo(product.createdAt)}</span>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <Badge
                    variant={isSold ? "sold" : product.status === "Reserved" ? "reserved" : "available"}
                    className="text-[10px]"
                  >
                    {product.status}
                  </Badge>

                  <Link href={`/product/${pId}`}>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1 h-8 px-2.5">
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </Link>

                  <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)} className="rounded-lg text-xs gap-1 h-8 px-2.5">
                    <Pencil className="h-3 w-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSold(product)}
                    className={`rounded-lg text-xs gap-1 h-8 px-2.5 ${
                      isSold
                        ? "text-emerald-600 hover:text-emerald-700 hover:border-emerald-300"
                        : "text-purple-600 hover:text-purple-700 hover:border-purple-300"
                    }`}
                  >
                    {isSold ? <RotateCcw className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                    <span className="hidden sm:inline">{isSold ? "Relist" : "Mark Sold"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingProduct(product)}
                    className="rounded-lg text-xs gap-1 h-8 px-2.5 text-rose-500 hover:text-rose-600 hover:border-rose-300"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmationModal
          product={deletingProduct}
          isOpen={true}
          onClose={() => setDeletingProduct(null)}
          onConfirm={(id) => handleDelete(id)}
        />
      )}
    </div>
  );
}
