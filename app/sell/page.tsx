import { Metadata } from "next";
import { PlusCircle } from "lucide-react";
import { SellProductForm } from "@/components/sell/SellProductForm";

export const metadata: Metadata = {
  title: "Sell Product – CampusKart",
  description: "List your used textbooks, calculators, electronics and campus gear for sale, exchange or giveaway.",
};

export default function SellPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2ee] px-3.5 py-1 text-xs font-bold text-[#ff4000] border border-[#ff4000]/20 mb-3">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Campus Seller Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            List an Item on CampusKart
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Declutter your hostel room or pass forward past semester books. Fast, free, and directly with fellow students.
          </p>
        </div>

        {/* Sell Form */}
        <SellProductForm />
      </div>
    </div>
  );
}

