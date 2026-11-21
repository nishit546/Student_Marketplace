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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff4000]" />
          <p className="text-sm font-medium text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center max-w-md">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
          <h3 className="text-lg font-bold text-neutral-900">Dashboard Unavailable</h3>
          <p className="mt-2 text-sm text-neutral-600">{error || "Unable to load statistics."}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Listings", value: stats.totalListings, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active & Live", value: stats.activeListings, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Sold Items", value: stats.soldListings, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
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
    <div className="p-5 sm:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Seller Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Welcome back, <span className="font-semibold text-neutral-800">Arnav</span>! Here is an overview of your campus marketplace activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs hover:shadow-sm transition-shadow"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg} ${card.color} mb-3`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-900">
                {typeof card.value === "number" ? card.value : card.value}
              </p>
              <p className="text-[11px] font-semibold text-neutral-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 cursor-pointer hover:border-[#ff4000]/30 hover:shadow-sm transition-all group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2ee] text-[#ff4000]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 group-hover:text-[#ff4000] transition-colors truncate">
                    {action.label}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-neutral-400 group-hover:text-[#ff4000] transition-colors shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#ff4000]" />
              Recent Listings
            </h3>
            <Link href="/dashboard/listings" className="text-xs font-semibold text-[#ff4000] hover:underline">
              View All
            </Link>
          </div>
          {stats.recentListings.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">No listings yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentListings.map((p: Product) => {
                const pId = p.id || p._id || "";
                return (
                  <Link key={pId} href={`/product/${pId}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                      <Image src={p.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=80&q=60"} alt={p.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{p.name}</p>
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
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#ff4000]" />
              Recent Enquiries
            </h3>
            <Link href="/dashboard/enquiries" className="text-xs font-semibold text-[#ff4000] hover:underline">
              View All
            </Link>
          </div>
          {stats.recentEnquiries.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">No enquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentEnquiries.map((e: Enquiry) => {
                const eId = e.id || e._id || "";
                const prod = typeof e.product === "object" ? e.product : null;
                return (
                  <div key={eId} className="flex items-start gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0 text-xs font-bold">
                      {e.buyerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{e.buyerName}</p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        Re: {prod ? (prod as Product).name : "Product"} · {formatTimeAgo(e.createdAt)}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
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
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#ff4000]" />
              Recent Offers
            </h3>
            <Link href="/dashboard/offers" className="text-xs font-semibold text-[#ff4000] hover:underline">
              View All
            </Link>
          </div>
          {stats.recentOffers.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">No price offers received yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.recentOffers.map((o: Offer) => {
                const oId = o.id || o._id || "";
                const prod = typeof o.product === "object" ? o.product as Product : null;
                return (
                  <div key={oId} className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff2ee] text-[#ff4000] shrink-0 text-xs font-bold">
                      {o.buyerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{o.buyerName}</p>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-neutral-400 line-through">₹{prod?.price}</span>
                        <span className="font-bold text-[#ff4000]">₹{o.offeredPrice}</span>
                        <span className="text-neutral-400">· {formatTimeAgo(o.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
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
