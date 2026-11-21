"use client";

import * as React from "react";
import Link from "next/link";
import {
  Tag,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { Offer, Product } from "@/types";

const DEMO_SELLER_EMAIL = "arnav.gupta@college.edu";

export default function DashboardOffers() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [confirmAccept, setConfirmAccept] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`/api/offers?sellerEmail=${DEMO_SELLER_EMAIL}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setOffers(json.data || []);
      } else {
        setError(json.message || "Failed to load offers");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { fetchOffers(); }, []);

  const handleAcceptOffer = async (offerId: string, productId: string) => {
    setProcessing(offerId);
    try {
      // 1. Accept the offer
      await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Accepted" }),
      });

      // 2. Mark product as Sold
      await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Sold" }),
      });

      // 3. Reject all other pending offers for this product
      const otherPending = offers.filter(
        (o) => {
          const oProd = typeof o.product === "object" ? (o.product as Product) : null;
          const oProdId = oProd ? (oProd.id || oProd._id) : "";
          return oProdId === productId && (o.id || o._id) !== offerId && o.status === "Pending";
        }
      );

      for (const other of otherPending) {
        const otherId = other.id || other._id || "";
        await fetch(`/api/offers/${otherId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected" }),
        });
      }

      // Refresh
      await fetchOffers();
    } catch (err) {
      console.error("Failed to accept offer:", err);
    } finally {
      setProcessing(null);
      setConfirmAccept(null);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    setProcessing(offerId);
    try {
      await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      });
      setOffers((prev) =>
        prev.map((o) => ((o.id || o._id) === offerId ? { ...o, status: "Rejected" as Offer["status"] } : o))
      );
    } catch (err) {
      console.error("Failed to reject offer:", err);
    } finally {
      setProcessing(null);
    }
  };

  const filtered = React.useMemo(() => {
    if (statusFilter === "All") return offers;
    return offers.filter((o) => o.status === statusFilter);
  }, [offers, statusFilter]);

  const statusCounts = React.useMemo(() => ({
    All: offers.length,
    Pending: offers.filter((o) => o.status === "Pending").length,
    Accepted: offers.filter((o) => o.status === "Accepted").length,
    Rejected: offers.filter((o) => o.status === "Rejected").length,
  }), [offers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ff4000]" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2ee] px-3.5 py-1 text-xs font-bold text-[#ff4000] border border-[#ff4000]/20 mb-2">
          <Tag className="h-3.5 w-3.5" />
          <span>Price Negotiations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Offers
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {offers.length} total offer{offers.length === 1 ? "" : "s"} · {statusCounts.Pending} pending
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(["All", "Pending", "Accepted", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === tab
                ? "bg-[#ff4000] text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {tab} ({statusCounts[tab]})
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
          <p className="text-sm text-neutral-700">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center">
          <Tag className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="font-bold text-neutral-900">No offers found</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {statusFilter !== "All"
              ? `No ${statusFilter.toLowerCase()} offers at the moment.`
              : "You haven't received any price offers yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((offer) => {
            const oId = offer.id || offer._id || "";
            const prod = typeof offer.product === "object" ? (offer.product as Product) : null;
            const pId = prod ? (prod.id || prod._id || "") : "";
            const isProcessing = processing === oId;
            const showConfirm = confirmAccept === oId;
            const discount = prod && prod.price > 0 ? Math.round(((prod.price - offer.offeredPrice) / prod.price) * 100) : 0;

            return (
              <div key={oId} className="rounded-lg border border-neutral-200 bg-white p-3.5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Buyer */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff2ee] text-[#ff4000] font-bold shrink-0 text-xs">
                      {offer.buyerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900">{offer.buyerName}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{offer.buyerEmail}</p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        Re: {prod?.name || "Product"} · {formatTimeAgo(offer.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Price Comparison */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-neutral-400">Listed</p>
                      <p className="text-sm font-bold text-neutral-700">
                        {prod ? formatPrice(prod.price, prod.listingType) : "—"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-[#ff4000]">Offered</p>
                      <p className="text-sm font-black text-[#ff4000]">₹{offer.offeredPrice.toLocaleString("en-IN")}</p>
                    </div>
                    {discount > 0 && (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      offer.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      offer.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}>
                      {offer.status}
                    </span>

                    {prod && pId && (
                      <Link href={`/product/${pId}`}>
                        <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1 h-8 px-2.5">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}

                    {offer.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => setConfirmAccept(oId)}
                          className="rounded-lg text-xs gap-1 h-8 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Accept</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleRejectOffer(oId)}
                          className="rounded-lg text-xs gap-1 h-8 text-rose-500 hover:text-rose-600 hover:border-rose-300"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Buyer message */}
                {offer.message && (
                  <div className="mt-3 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600 border border-neutral-100">
                    <span className="font-semibold text-neutral-500">Note: </span>{offer.message}
                  </div>
                )}

                {/* Accept Confirmation */}
                {showConfirm && (
                  <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-amber-900">Confirm Acceptance</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Accepting this offer will mark <strong>{prod?.name || "the product"}</strong> as <strong>Sold</strong> and reject all other pending offers for this item.
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleAcceptOffer(oId, pId)}
                        className="rounded-lg text-xs h-8 bg-emerald-600 hover:bg-emerald-700 gap-1"
                      >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                        <span>{isProcessing ? "Processing..." : "Yes, Accept"}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => setConfirmAccept(null)}
                        className="rounded-lg text-xs h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
