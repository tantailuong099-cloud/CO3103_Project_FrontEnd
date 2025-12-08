"use client";

import ProductGallery from "./ProductGallery";
import BuyOption from "./BuyOption";
import CardLayout from "@/app/components/pages/card/GameCardSample";


export default function BuySection({ product }: { product: any}) {
  return (
    <>
      {/* Title + meta (ĐÃ SỬA) */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
          <p className="truncate">{product.type}</p>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span className="border border-[#fe8c31] text-[#fe8c31] px-2 py-[2px] rounded-full text-xs">
            {typeof product.metacriticScore === "number" 
              ? product.metacriticScore.toFixed(1) 
              : product.metacriticScore
            }
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
         <ProductGallery images={product.productImage.slice(2)} title={product.name} />

        </div>

        <aside className="lg:col-span-5">
          <BuyOption product={product} />
        </aside>
      </section>
    </>
  );
}