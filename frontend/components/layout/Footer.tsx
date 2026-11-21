import Link from "next/link";
import { ShoppingBag, ShieldCheck, HeartHandshake, Zap, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* Value Proposition Highlights */}
      <div className="border-b border-neutral-100 bg-[#fffdfc] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ee] text-[#ff4000]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">100% Student Verified</h4>
                <p className="text-xs text-neutral-500">Peer-to-peer exchanges within college campus</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ee] text-[#ff4000]">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Zero Middlemen Fees</h4>
                <p className="text-xs text-neutral-500">Free to list, free to negotiate, keep 100% savings</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2ee] text-[#ff4000]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Instant Campus Meetups</h4>
                <p className="text-xs text-neutral-500">Meet at library, hostel gate or canteen in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff4000] text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-neutral-900">
                Campus<span className="text-[#ff4000]">Kart</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-neutral-500 leading-relaxed">
              CampusKart is the student-focused marketplace for buying, selling, and giving away used textbooks, electronics, calculators, and dorm essentials with campus peers.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <Sparkles className="h-3.5 w-3.5 text-[#ff4000]" />
              <span>Designed with clean aesthetics for university communities</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Popular Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="/explore?category=Books+%26+Textbooks" className="hover:text-[#ff4000] transition-colors">
                  Books & Textbooks
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Calculators" className="hover:text-[#ff4000] transition-colors">
                  Scientific Calculators
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Electronics" className="hover:text-[#ff4000] transition-colors">
                  Electronics & Tech
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Stationery" className="hover:text-[#ff4000] transition-colors">
                  Drafters & Stationery
                </Link>
              </li>
              <li>
                <Link href="/explore?type=Free" className="hover:text-[#ff4000] transition-colors font-medium text-emerald-700">
                  Free Senior Giveaways
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Marketplace
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="/explore" className="hover:text-[#ff4000] transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-[#ff4000] transition-colors">
                  Create a Listing
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className="hover:text-[#ff4000] transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-[#ff4000] transition-colors">
                  Saved Products
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#ff4000] transition-colors">
                  Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Safety & Guidelines
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-600">
              <li>
                <span className="text-neutral-500">Meet in Public Spaces</span>
              </li>
              <li>
                <span className="text-neutral-500">Inspect Before Paying</span>
              </li>
              <li>
                <span className="text-neutral-500">Use UPI On Handover</span>
              </li>
              <li>
                <span className="text-neutral-500">Report Inappropriate Items</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} CampusKart Marketplace. Built for university students.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Live Campus Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

