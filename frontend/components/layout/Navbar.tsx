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
import { useFavorites } from "@/context/FavoritesContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { favoritesCount } = useFavorites();

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
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff4000] text-white">
            <ShoppingBag className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              Campus<span className="text-[#ff4000]">Kart</span>
            </span>
            <span className="hidden sm:inline-flex rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
              CAMPUS
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
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
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
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            title="Saved Items"
          >
            <Heart className="h-4.5 w-4.5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Dashboard Link */}
          <Link
            href="/my-listings"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/my-listings"
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
            title="My Listings"
          >
            <Package className="h-4 w-4" />
            <span>My Listings</span>
          </Link>

          {/* Sell Button */}
          <Link href="/sell">
            <Button size="sm" className="rounded-lg font-medium">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>List Item</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link href="/sell">
            <Button size="sm" className="rounded-md text-xs font-medium px-2.5">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Sell</span>
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-4.5 w-4.5" />
            ) : (
              <Menu className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-4">
          <div className="space-y-1">
            <Link
              href="/explore"
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Compass className="h-4 w-4 text-[#ff4000]" />
              <span>Explore Marketplace</span>
            </Link>
            <Link
              href="/#categories"
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Search className="h-4 w-4 text-neutral-500" />
              <span>Browse Categories</span>
            </Link>
            <Link
              href="/my-listings"
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <Package className="h-4 w-4 text-[#ff4000]" />
              <span>My Listings</span>
            </Link>
            <Link
              href="/favorites"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Saved Items</span>
              </div>
              {favoritesCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <LayoutDashboard className="h-4 w-4 text-neutral-500" />
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
