"use client";

import ProductGallery from "./ProductGallery";
import BuyOption from "./BuyOption";

export default function BuySection({ product }: { product: any }) {
  // ✅ Gộp avatar và mảng productImage lại để gallery đầy đủ nhất
  // Lọc bỏ các giá trị null/undefined hoặc chuỗi rỗng
 const allImages = (product?.productImage || [])
    .slice(1) // 👈 lấy từ index 1 trở đi
    .filter(
      (img) => img && typeof img === "string" && img.trim() !== ""
    );
  

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
          <p className="truncate uppercase">{product.type}</p>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span className="border border-[#fe8c31] text-[#fe8c31] px-2 py-[2px] rounded-full text-xs font-bold">
            {typeof product.metacriticScore === "number"
              ? product.metacriticScore.toFixed(1)
              : product.metacriticScore || "N/A"}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          {/* ✅ SỬA TẠI ĐÂY: Truyền allImages thay vì product.productImage.slice(2) */}
          <ProductGallery images={allImages} title={product.name} />
        </div>

        <aside className="lg:col-span-5">
          <BuyOption product={product} />
        </aside>
      </section>
    </>
  );
}
