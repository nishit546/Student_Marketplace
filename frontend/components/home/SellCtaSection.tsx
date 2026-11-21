import Link from "next/link";
import { PlusCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SellCtaSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-neutral-900 px-6 py-10 sm:px-10 sm:py-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Have items to sell or pass down?
            </h2>

            <p className="mt-2.5 text-sm text-neutral-300 leading-relaxed">
              Don’t let last semester’s books, calculators, or dorm gear sit unused.
              Help junior students save money and earn extra cash.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/sell">
                <Button
                  size="default"
                  className="rounded-lg font-medium bg-[#ff4000] text-white hover:bg-[#e03800]"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>List an Item for Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/explore">
                <Button
                  variant="outline"
                  size="default"
                  className="rounded-lg border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 hover:border-neutral-600"
                >
                  Browse Listings
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-5 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero listing fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Keep 100% of the sale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
