import Link from "next/link";
import { SearchX, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="min-h-[70vh] bg-[#fafafa] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-neutral-200/90 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff2ee] text-[#ff4000] mb-5">
          <SearchX className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
          Product Listing Not Found
        </h1>

        <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
          This campus listing might have been removed by the seller, marked as sold, or the link may be incorrect.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/explore" className="w-full sm:w-auto">
            <Button className="w-full rounded-xl gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Marketplace</span>
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-xl gap-2 border-neutral-300">
              <ArrowLeft className="h-4 w-4" />
              <span>Back Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

