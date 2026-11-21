import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { RecentProducts } from "@/components/home/RecentProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SellCtaSection } from "@/components/home/SellCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <RecentProducts />
      <HowItWorks />
      <SellCtaSection />
    </div>
  );
}
