"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  CheckCircle2,
  ShoppingBag,
  MessageSquare,
  Tag,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { DashboardStats, Product, Enquiry, Offer } from "@/types";

export default function DashboardOverview() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          setError(json.message || "Failed to load dashboard");
        }
      } catch {
        setError("Could not connect to the server. Make sure MongoDB is running.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#ff4000]" />
          <p className="text-xs font-medium text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center max-w-md">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
          <h3 className="text-base font-bold text-neutral-900">Dashboard Unavailable</h3>
          <p className="mt-1.5 text-xs text-neutral-600">{error || "Unable to load statistics."}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Listings", value: stats.totalListings, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Listings", value: stats.activeListings, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Sold Products", value: stats.soldListings, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Enquiries", value: stats.pendingEnquiries, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Offers", value: stats.pendingOffers, icon: Tag, color: "text-[#ff4000]", bg: "bg-[#fff2ee]" },
    { label: "Active Value", value: `₹${stats.totalActiveValue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  const quickActions = [
    { label: "Add New Product", href: "/sell", icon: PlusCircle },
    { label: "My Listings", href: "/dashboard/listings", icon: Package },
    { label: "View Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
    { label: "View Offers", href: "/dashboard/offers", icon: Tag },
  ];

  return (
    <div className="p-5 sm:p-7 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Seller Dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Overview of your campus marketplace listings, enquiries, and offers.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-neutral-200 bg-white p-3.5"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${card.bg} ${card.color} mb-2.5`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold text-neutral-900">
                {typeof card.value === "number" ? card.value : card.value}
              </p>
              <p className="text-[11px] font-medium text-neutral-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-300 transition-colors group cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-700">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 group-hover:text-[#ff4000] transition-colors truncate">
                    {action.label}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Listings */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-500" />
              Recent Listings
            </h3>
            <Link href="/dashboard/listings" className="text-xs font-medium text-[#ff4000] hover:underline">
              View All
            </Link>
          </div>
          {stats.recentListings.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No listings yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentListings.map((p: Product) => {
                const pId = p.id || p._id || "";
                return (
                  <Link key={pId} href={`/product/${pId}`} className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                    <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-neutral-100">
                      <Image src={p.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=80&q=60"} alt={p.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-neutral-500">{formatPrice(p.price, p.listingType)} · {p.category}</p>
                    </div>
                    <Badge variant={p.status === "Sold" ? "sold" : "available"} className="text-[10px] shrink-0">
                      {p.status}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-neutral-500" />
              Recent Enquiries
            </h3>
            <Link href="/dashboard/enquiries" className="text-xs font-medium text-[#ff4000] hover:underline">
              View All
            </Link>
          </div>
          {stats.recentEnquiries.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No enquiries received yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentEnquiries.map((e: Enquiry) => {
                const eId = e.id || e._id || "";
                const prod = typeof e.product === "object" ? e.product : null;
                return (
                  <div key={eId} className="flex items-start gap-2.5 p-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600 shrink-0 text-xs font-bold">
                      {e.buyerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{e.buyerName}</p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        Re: {prod ? (prod as Product).name : "Product"} · {formatTimeAgo(e.createdAt)}
                      </p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                      e.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      e.status === "Responded" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      "bg-neutral-100 text-neutral-500 border border-neutral-200"
                    }`}>
                      {e.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Offers */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-neutral-500" />
              Recent Offers
            </h3>
            <Link href="/dashboard/offers" className="text-xs font-medium text-[#ff4000] hover:underline">
              View All
            </Link>
          </div>
          {stats.recentOffers.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">No price offers received yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stats.recentOffers.map((o: Offer) => {
                const oId = o.id || o._id || "";
                const prod = typeof o.product === "object" ? o.product as Product : null;
                return (
                  <div key={oId} className="flex items-center gap-2.5 p-2.5 rounded-md border border-neutral-200 bg-neutral-50/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fff2ee] text-[#ff4000] shrink-0 text-xs font-bold">
                      {o.buyerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{o.buyerName}</p>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-neutral-400 line-through">₹{prod?.price}</span>
                        <span className="font-bold text-[#ff4000]">₹{o.offeredPrice}</span>
                        <span className="text-neutral-400">· {formatTimeAgo(o.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                      o.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      o.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
