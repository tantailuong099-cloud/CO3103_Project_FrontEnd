"use client";

import Hero from "../components/pages/section/Hero";
import ProductSection from "../components/pages/section/ProductSection";
import { makeMockProducts } from "@/app/components/mockup/product";

export default function Home() {
  const products = makeMockProducts(20, {
    seed: 1, 
    defaults: { image: "/images/EldenRing_poster.jpg" },
  });

  return (
    <div className="space-y-0">
      <Hero />

      <ProductSection
        title="FLASH SALE"
        variant="flash-sale"
      />

      <ProductSection
        title="TOP PICKS FOR YOU"
        products={products}
      />

      <ProductSection
        title="MOST POPULAR"
        products={products}
      />
    </div>
  );
}
