import Link from "next/link";
import { PlusCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SellCtaSection() {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 sm:px-12 sm:py-16 text-white shadow-xl">
          {/* Background warm glow */}
          <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-[#ff4000]/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 -z-0 h-64 w-64 rounded-full bg-[#ff4000]/15 blur-2xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#ff8040] backdrop-blur-md border border-white/10 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#ff4000]" />
              <span>Campus Seller Hub</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to declutter your room or pass forward your semester books?
            </h2>

            <p className="mt-4 text-base text-neutral-300 leading-relaxed">
              Don’t let last semester’s notes, calculators, or dorm gear collect dust.
              Give them a second life, help junior students save money, and earn extra pocket cash.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/sell">
                <Button
                  size="lg"
                  className="rounded-xl font-bold bg-[#ff4000] text-white hover:bg-[#e03800] shadow-md shadow-[#ff4000]/25"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Start Selling For Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30"
                >
                  Explore Current Listings
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero listing fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Keep 100% of the sale</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>No courier packing needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

