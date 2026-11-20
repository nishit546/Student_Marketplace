import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductsProvider } from "@/context/ProductsContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const metadata: Metadata = {
  title: "CampusKart – Student Second-Hand Marketplace",
  description:
    "Buy, sell, exchange and give away used textbooks, electronics, calculators, and dorm essentials within your college campus.",
  keywords: [
    "student marketplace",
    "college second hand",
    "buy used textbooks",
    "scientific calculator",
    "campus buy and sell",
    "dorm essentials",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fafafa] text-neutral-900 antialiased selection:bg-[#ffe5dc] selection:text-[#ff4000]">
        <ProductsProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </FavoritesProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
