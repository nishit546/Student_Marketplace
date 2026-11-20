"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/utils";
import { Enquiry, Product } from "@/types";

const DEMO_SELLER_EMAIL = "arnav.gupta@college.edu";

export default function DashboardEnquiries() {
  const [enquiries, setEnquiries] = React.useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(`/api/enquiries?sellerEmail=${DEMO_SELLER_EMAIL}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data || []);
      } else {
        setError(json.message || "Failed to load enquiries");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { fetchEnquiries(); }, []);

  const handleUpdateStatus = async (enquiryId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) =>
          prev.map((e) => ((e.id || e._id) === enquiryId ? { ...e, status: newStatus as Enquiry["status"] } : e))
        );
      }
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
    }
  };

  const filtered = React.useMemo(() => {
    if (statusFilter === "All") return enquiries;
    return enquiries.filter((e) => e.status === statusFilter);
  }, [enquiries, statusFilter]);

  const statusCounts = React.useMemo(() => ({
    All: enquiries.length,
    Pending: enquiries.filter((e) => e.status === "Pending").length,
    Responded: enquiries.filter((e) => e.status === "Responded").length,
    Closed: enquiries.filter((e) => e.status === "Closed").length,
  }), [enquiries]);

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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/60 mb-2">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Buyer Enquiries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Enquiries
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {enquiries.length} total enquir{enquiries.length === 1 ? "y" : "ies"} · {statusCounts.Pending} pending
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(["All", "Pending", "Responded", "Closed"] as const).map((tab) => (
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
          <p className="text-sm text-neutral-700">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="font-bold text-neutral-900">No enquiries found</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {statusFilter !== "All"
              ? `No ${statusFilter.toLowerCase()} enquiries at the moment.`
              : "You haven't received any buyer enquiries yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((enq) => {
            const eId = enq.id || enq._id || "";
            const prod = typeof enq.product === "object" ? (enq.product as Product) : null;
            const pId = prod ? (prod.id || prod._id || "") : "";
            const isExpanded = expandedId === eId;

            return (
              <div key={eId} className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden transition-all hover:shadow-sm">
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : eId)}
                  className="w-full text-left flex items-center gap-3 p-4 cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold text-sm shrink-0">
                    {enq.buyerName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900">{enq.buyerName}</p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {enq.buyerEmail} · Re: {prod?.name || "Product"} · {formatTimeAgo(enq.createdAt)}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    enq.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    enq.status === "Responded" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                    "bg-neutral-100 text-neutral-500 border border-neutral-200"
                  }`}>
                    {enq.status}
                  </span>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-neutral-100 px-4 py-4 bg-neutral-50/50">
                    <div className="rounded-xl bg-white border border-neutral-100 p-3 mb-3">
                      <p className="text-xs font-semibold text-neutral-500 mb-1">Message from buyer:</p>
                      <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line">{enq.message}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {prod && pId && (
                        <Link href={`/product/${pId}`}>
                          <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1 h-8">
                            <Eye className="h-3 w-3" />
                            <span>View Product</span>
                          </Button>
                        </Link>
                      )}
                      {enq.status === "Pending" && (
                        <Button size="sm" onClick={() => handleUpdateStatus(eId, "Responded")} className="rounded-lg text-xs gap-1 h-8 bg-blue-600 hover:bg-blue-700">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Mark Responded</span>
                        </Button>
                      )}
                      {enq.status !== "Closed" && (
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(eId, "Closed")} className="rounded-lg text-xs gap-1 h-8 text-neutral-500">
                          <XCircle className="h-3 w-3" />
                          <span>Close</span>
                        </Button>
                      )}
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
