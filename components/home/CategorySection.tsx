import Link from "next/link";
import {
  BookOpen,
  Laptop,
  Calculator,
  Armchair,
  PenTool,
  Backpack,
  Package,
  Activity,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_CATEGORIES } from "@/lib/sample-data";

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Laptop,
  Calculator,
  Armchair,
  PenTool,
  Backpack,
  Package,
  Activity,
};

export function CategorySection() {
  return (
    <section id="categories" className="py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Common essentials traded across hostel blocks and libraries.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#ff4000] hover:text-[#e03800]"
          >
            <span>All Categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {SAMPLE_CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || Package;
            return (
              <Link
                key={cat.id}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                      {cat.itemCount}+
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[#ff4000] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-neutral-600 group-hover:text-[#ff4000] pt-2 border-t border-neutral-100">
                  <span>Browse items</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}

          {/* Quick Sell Tile */}
          <Link
            href="/sell"
            className="group relative flex flex-col justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4 hover:border-neutral-300 transition-colors"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff4000] text-white mb-3">
                <span className="text-xl font-bold">+</span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[#ff4000] transition-colors">
                List an Item
              </h3>
              <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                Post your textbooks or gadgets to sell or give away to campus peers.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#ff4000] pt-2 border-t border-neutral-200/60">
              <span>Create listing</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
