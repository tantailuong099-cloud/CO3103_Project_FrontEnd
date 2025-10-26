"use client";

import ProductGallery from "./ProductGallery";
import BuyOption from "./BuyOption";
import CardLayout from "@/app/components/pages/card/GameCardSample";

type P = {
  product: {
    id: number;
    title: string;
    genre?: string[];
    subtitle?: string;
    image: string;
    price: number | string;
    discount?: number | string | null;
    rating: number | string;
    tags?: string[];
  };
  related: P["product"][];
};

export default function BuySection({ product, related }: P) {
  return (
    <>
      {/* Title + meta */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
          <p className="truncate">{(product.genre || []).join(", ")}</p>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span className="border border-[#fe8c31] text-[#fe8c31] px-2 py-[2px] rounded-full text-xs">
            {typeof product.rating === "number" ? product.rating.toFixed(1) : product.rating}
          </span>
        </div>
      </header>

      {/* Two-column */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ProductGallery
            mainSrc={product.image}
            thumbs={[product.image, product.image, product.image, product.image]}
            title={product.title}
          />
        </div>

        <aside className="lg:col-span-5">
          <BuyOption product={product} />
        </aside>
      </section>

    </>
  );
}
