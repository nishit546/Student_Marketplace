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
      <div className="lg:hidden sticky top-16 z-30 flex items-center justify-between border-b border-neutral-200/80 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl p-2 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h2 className="text-sm font-bold text-neutral-900">Seller Dashboard</h2>
        </div>
        <Link href="/sell">
          <Button size="sm" className="rounded-xl text-xs font-semibold gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Listing</span>
          </Button>
        </Link>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 lg:top-16 z-20 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-neutral-200/80 bg-white transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col p-4">
            {/* Seller Identity */}
            <div className="rounded-2xl bg-gradient-to-br from-[#ff4000] to-[#e63900] p-4 text-white mb-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold text-lg">
                  A
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">Arnav Gupta</p>
                  <p className="text-[11px] opacity-80 truncate">Hostel Block B, Room 312</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#fff2ee] text-[#ff4000] font-semibold"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${active ? "text-[#ff4000]" : ""}`} />
                    <span>{item.label}</span>
                    {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#ff4000]" />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Links */}
            <div className="border-t border-neutral-100 pt-3 mt-3 space-y-1">
              <Link
                href="/explore"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Compass className="h-4 w-4" />
                <span>Back to Marketplace</span>
              </Link>
              <Link href="/sell">
                <Button className="w-full rounded-xl font-semibold gap-2 mt-2">
                  <PlusCircle className="h-4 w-4" />
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
