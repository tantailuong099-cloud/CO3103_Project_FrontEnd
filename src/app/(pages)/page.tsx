"use client";

import Hero from "../components/pages/section/Hero";
import ProductSection from "../components/pages/section/ProductSection";

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />

      <ProductSection
        title="RECENTLY ADDED"
        variant="added"
      />

      <ProductSection
        title="NEW RELEASED"
        variant="released"
      />

      <ProductSection
        title="MOST POPULAR"
        variant="popular"
      />
    </div>
  );
}
