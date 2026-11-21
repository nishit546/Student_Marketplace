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
    <section id="categories" className="py-14 sm:py-20 bg-white border-b border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold tracking-wider text-[#ff4000] uppercase mb-1.5">
              Explore By Category
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              What are you looking for today?
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Browse through curated essentials commonly traded across campus hostels and libraries.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#ff4000] hover:text-[#e03800] group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">
          {SAMPLE_CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || Package;
            return (
              <Link
                key={cat.id}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-[#fafafa] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff4000]/40 hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-200 text-[#ff4000] transition-colors group-hover:bg-[#ff4000] group-hover:text-white group-hover:border-[#ff4000] shadow-sm">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-neutral-600 border border-neutral-200 group-hover:border-[#ff4000]/30 group-hover:text-[#ff4000]">
                      {cat.itemCount}+
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#ff4000] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-neutral-600 group-hover:text-[#ff4000] pt-2">
                  <span>Browse items</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}

          {/* Quick Sell Tile in Grid */}
          <Link
            href="/sell"
            className="group relative flex flex-col justify-between rounded-2xl border-2 border-dashed border-[#ff4000]/30 bg-[#fff9f7] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff4000] hover:bg-[#fff2ee] hover:shadow-md"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff4000] text-white shadow-sm mb-4">
                <span className="text-2xl font-black">+</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#ff4000] transition-colors">
                Have items to declutter?
              </h3>
              <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                Post your textbooks or gadgets in 2 minutes and get instant inquiries from campus peers.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#ff4000] pt-2">
              <span>Post a free listing</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

