import Link from "next/link";
import { ShoppingBag, ShieldCheck, HeartHandshake, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* Value Highlights */}
      <div className="border-b border-neutral-100 bg-[#fafafa] py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200/60 text-neutral-800">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Student Verified</h4>
                <p className="text-xs text-neutral-500">Exchanges within college campus communities</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200/60 text-neutral-800">
                <HeartHandshake className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Zero Middlemen Fees</h4>
                <p className="text-xs text-neutral-500">Free to list and free to negotiate</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-200/60 text-neutral-800">
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">Campus Meetups</h4>
                <p className="text-xs text-neutral-500">Meet at the library, canteen, or hostel gate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4000] text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900">
                Campus<span className="text-[#ff4000]">Kart</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-neutral-500 leading-relaxed">
              CampusKart is the student marketplace for buying, selling, and giving away used textbooks, calculators, electronics, and hostel essentials.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/explore?category=Books+%26+Textbooks" className="hover:text-neutral-900 transition-colors">
                  Books & Textbooks
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Calculators" className="hover:text-neutral-900 transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Electronics" className="hover:text-neutral-900 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Stationery" className="hover:text-neutral-900 transition-colors">
                  Stationery
                </Link>
              </li>
              <li>
                <Link href="/explore?type=Free" className="hover:text-neutral-900 transition-colors text-emerald-700 font-medium">
                  Free Giveaways
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Marketplace
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/explore" className="hover:text-neutral-900 transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-neutral-900 transition-colors">
                  Create a Listing
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className="hover:text-neutral-900 transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-neutral-900 transition-colors">
                  Saved Products
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">
                  Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Guidelines
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <span className="text-neutral-500">Meet in Public Spaces</span>
              </li>
              <li>
                <span className="text-neutral-500">Inspect Before Paying</span>
              </li>
              <li>
                <span className="text-neutral-500">Use UPI On Handover</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} CampusKart. Peer-to-peer campus marketplace.</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Campus Network Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
