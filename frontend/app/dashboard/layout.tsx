"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Tag,
  Heart,
  Compass,
  PlusCircle,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Listings", href: "/dashboard/listings", icon: Package },
  { label: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
  { label: "Offers", href: "/dashboard/offers", icon: Tag },
  { label: "Favorites", href: "/favorites", icon: Heart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h2 className="text-sm font-semibold text-neutral-900">Seller Dashboard</h2>
        </div>
        <Link href="/sell">
          <Button size="sm" className="rounded-lg text-xs font-medium gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Listing</span>
          </Button>
        </Link>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 lg:top-16 z-20 h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-neutral-200 bg-white transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col p-3.5">
            {/* Seller Identity */}
            <div className="rounded-lg bg-neutral-900 p-3 text-white mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 font-bold text-sm">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">Arnav Gupta</p>
                  <p className="text-[11px] text-neutral-300 truncate">Hostel Block B, Room 312</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-0.5 flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-neutral-100 text-neutral-900 font-semibold"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-[#ff4000]" : ""}`} />
                    <span>{item.label}</span>
                    {active && <ChevronRight className="ml-auto h-3 w-3 text-neutral-400" />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Links */}
            <div className="border-t border-neutral-100 pt-3 mt-3 space-y-1">
              <Link
                href="/explore"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              >
                <Compass className="h-4 w-4" />
                <span>Back to Marketplace</span>
              </Link>
              <Link href="/sell">
                <Button size="sm" className="w-full rounded-md font-medium gap-1.5 mt-2">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Create Listing</span>
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
