"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ProductGallery({ images, title }: Props) {
  // 1. Ảnh mặc định nếu dữ liệu lỗi hoặc rỗng
  const PLACEHOLDER = "/images/placeholder-game.png";

  // 2. Lọc bỏ các chuỗi rỗng hoặc undefined trong mảng images
  const validImages = images?.filter((img) => img && img.trim() !== "") || [];

  // 3. Nếu mảng hoàn toàn rỗng, sử dụng mảng chứa 1 ảnh placeholder
  const displayImages = validImages.length > 0 ? validImages : [PLACEHOLDER];

  const [active, setActive] = useState(0);

  // Reset active index về 0 nếu danh sách ảnh thay đổi (tránh lỗi out of bounds)
  useEffect(() => {
    setActive(0);
  }, [images]);

  return (
    <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#303030]">
      {/* MAIN IMAGE */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-[#2a2a2a]">
        <Image
          // Đảm bảo luôn có giá trị hợp lệ cho src
          src={displayImages[active] || PLACEHOLDER}
          alt={title || "Product Image"}
          fill
          priority // Ưu tiên load ảnh chính để tránh lỗi LCP
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* THUMBNAILS - Chỉ hiển thị nếu có nhiều hơn 1 ảnh hoặc ảnh hợp lệ */}
      {validImages.length > 0 && (
        <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
          {displayImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-[16/10] rounded-lg overflow-hidden border transition
                ${
                  i === active
                    ? "border-[#fe8c31]"
                    : "border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#121212]"
                }`}
            >
              <Image
                src={src || PLACEHOLDER}
                alt={`${title} thumbnail ${i}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Nếu không có ảnh nào từ API, có thể hiện một dòng nhắc nhỏ (tùy chọn) */}
      {validImages.length === 0 && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          No preview images available
        </p>
      )}
    </div>
  );
}
