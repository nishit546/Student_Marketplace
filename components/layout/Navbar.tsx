"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  PlusCircle,
  Heart,
  LayoutDashboard,
  Compass,
  Menu,
  X,
  Search,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Categories", href: "/#categories" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4000] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-neutral-900">
                Campus<span className="text-[#ff4000]">Kart</span>
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-[#fff2ee] px-2 py-0.5 text-[10px] font-bold text-[#ff4000] border border-[#ff4000]/20">
                STUDENT
              </span>
            </div>
            <span className="hidden md:block text-[10px] text-neutral-500 font-medium -mt-1">
              Peer-to-peer campus marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#fff2ee] text-[#ff4000] font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Sell Button */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Favorites Link */}
          <Link
            href="/favorites"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            title="Saved Items"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Dashboard Link */}
          <Link
            href="/my-listings"
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/my-listings"
                ? "bg-[#fff2ee] text-[#ff4000] font-semibold"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
            title="My Listings"
          >
            <Package className="h-4 w-4" />
            <span>My Listings</span>
          </Link>

          {/* Sell Button */}
          <Link href="/sell">
            <Button className="rounded-xl font-semibold shadow-sm hover:shadow-md transition-all">
              <PlusCircle className="h-4 w-4" />
              <span>Sell Item</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link href="/sell">
            <Button size="sm" className="rounded-lg text-xs font-semibold px-3">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Sell</span>
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 bg-white px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <Link
              href="/explore"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Compass className="h-5 w-5 text-[#ff4000]" />
              <span>Explore Marketplace</span>
            </Link>
            <Link
              href="/#categories"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Search className="h-5 w-5 text-neutral-500" />
              <span>Browse Categories</span>
            </Link>
            <Link
              href="/my-listings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Package className="h-5 w-5 text-[#ff4000]" />
              <span>My Listings</span>
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Heart className="h-5 w-5 text-rose-500" />
              <span>Saved Items</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <LayoutDashboard className="h-5 w-5 text-neutral-500" />
              <span>Seller Dashboard</span>
            </Link>
            <div className="pt-2">
              <Link href="/sell" className="block w-full">
                <Button className="w-full justify-center">
                  <PlusCircle className="h-4 w-4" />
                  <span>List a Product</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

