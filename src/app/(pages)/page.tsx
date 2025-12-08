"use client";

import Hero from "../components/pages/section/Hero";
import ProductSection from "../components/pages/section/ProductSection";
import { makeMockProducts } from "@/app/components/mockup/product";

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />

      <ProductSection
        title="FLASH SALE"
        variant="flash-sale"
      />

      <ProductSection
        title="TOP PICKS FOR YOU"
      />

      <ProductSection
        title="MOST POPULAR"
      />
    </div>
  );
}
