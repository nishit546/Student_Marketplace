import Link from "next/link";
import { SearchX, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="min-h-[70vh] bg-[#fafafa] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 mb-4">
          <SearchX className="h-6 w-6" />
        </div>

        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Listing Not Found
        </h1>

        <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
          This campus listing may have been removed by the seller or marked as sold.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link href="/explore" className="w-full sm:w-auto">
            <Button className="w-full rounded-lg gap-2 font-medium">
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Marketplace</span>
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-lg gap-2 border-neutral-300 font-medium">
              <ArrowLeft className="h-4 w-4" />
              <span>Back Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
