"use client";

import ProductGallery from "./ProductGallery";
import BuyOption from "./BuyOption";
import CardLayout from "@/app/components/pages/card/GameCardSample";

// Không cần định nghĩa Type P ở đây nữa, 
// vì chúng ta nhận `product: any` từ `page.tsx`
// và sẽ truyền nó trực tiếp xuống.

export default function BuySection({ product, related }: { product: any, related: any[] }) {
  return (
    <>
      {/* Title + meta (ĐÃ SỬA) */}
      <header className="mb-6">
        {/* Sửa: product.title -> product.name */}
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
          {/* Sửa: product.genre -> product.type */}
          <p className="truncate">{product.type}</p>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span className="border border-[#fe8c31] text-[#fe8c31] px-2 py-[2px] rounded-full text-xs">
            {/* Sửa: product.rating -> product.metacriticScore */}
            {typeof product.metacriticScore === "number" 
              ? product.metacriticScore.toFixed(1) 
              : product.metacriticScore
            }
          </span>
        </div>
      </header>

      {/* Two-column (ĐÃ SỬA) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ProductGallery
            // Sửa: product.image -> product.avatar
            mainSrc={product.avatar}
            // Sửa: mảng hardcode -> product.productImage
            thumbs={product.productImage}
            // Sửa: product.title -> product.name
            title={product.name}
          />
        </div>

        <aside className="lg:col-span-5">
          <BuyOption product={product} />
        </aside>
      </section>
    </>
  );
}