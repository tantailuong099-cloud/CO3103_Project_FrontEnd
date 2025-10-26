"use client";

import Image from "next/image";
import { useState } from "react";

// Sửa: Nhận `product` từ props
export default function DetailSection({ product }: { product: any }) {
  const [expanded, setExpanded] = useState(false);

  // Hiển thị loading nếu chưa có data
  if (!product) {
    return (
      <section className="w-full bg-[#262626] text-white min-h-[50vh] grid place-items-center">
        <p>Loading details...</p>
      </section>
    );
  }

  // Sửa: Tạo bảng details từ `product`
  const details = [
    { label: "Genre", value: product.type || "N/A" },
    { label: "Platform", value: "Nintendo Switch 2, PS5, XBOX" }, // Giữ hardcode (không có trong schema)
    { label: "ESRB", value: product.ageConstraints ? `Ages ${product.ageConstraints}+` : "N/A" },
    { label: "Year Production", value: product.releaseDate ? new Date(product.releaseDate).getFullYear() : "N/A" },
    { label: "Manufacturer", value: "ABC" }, // Giữ hardcode (không có trong schema)
    { label: "Game file size", value: "ABC" }, // Giữ hardcode (không có trong schema)
    { label: "Players", value: product.minPlayer ? `Up to ${product.minPlayer} players` : "N/A" },
    { label: "Supported play modes", value: "TV mode, Tabletop mode, Handheld mode" }, // Giữ hardcode
    { label: "Supported languages", value: "..." }, // Giữ hardcode
  ];

  // Sửa: Lấy mô tả từ `product.description`
  const allParagraphs = product.description 
    ? product.description.split('\n').filter((p: string) => p.trim() !== "") 
    : ["No description available."];
  
  const storyParagraphs = allParagraphs.slice(0, 2); // 2 đoạn đầu
  const moreStory = allParagraphs.slice(2); // Các đoạn còn lại

  return (
    <section className="w-full bg-[#262626] text-white">
      {/* Header (Giữ nguyên) */}
      <div className="flex items-center bg-gradient-to-r from-[#fe8c31] to-[#f9393a] h-8 px-6 md:px-10 mb-6 rounded-sm">
        <p className="text-sm md:text-base font-bold tracking-wide">PRODUCT DETAILS</p>
      </div>

      {/* Trailer + Table (SỬA BẢNG) */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 md:gap-8 px-6 md:px-10 mb-12">
        {/* Trailer (Giữ nguyên, vì không có trong schema) */}
        <div className="w-full lg:w-[480px] aspect-video rounded-md overflow-hidden shadow-md">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/6XGeJwsUP9c"
            title="Hollow Knight: Silksong Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md"
          />
        </div>

        {/* Details Table (SỬA DATA) */}
        <div className="w-full lg:w-[640px] border border-[#e8e7e7] rounded-md overflow-hidden">
          {/* Dùng `details` đã tạo động ở trên */}
          {details.map((d, i) => (
            <div key={i} className="flex border-b border-[#e8e7e7] last:border-b-0">
              <div className="w-[220px] bg-[#1e1e1e] text-center font-semibold text-xs md:text-sm py-2.5 md:py-3 border-r border-[#e8e7e7]">
                {d.label}
              </div>
              <div className="flex-1 text-center text-[#bababa] text-xs md:text-sm py-2.5 md:py-3 bg-[#2b2b2b]">
                {d.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section (SỬA DATA) */}
      <div className="relative w-full overflow-hidden rounded-lg">
        {/* Background (SỬA IMAGE) */}
        <div className="absolute inset-0">
          <Image
            // Dùng ảnh đầu tiên trong gallery hoặc avatar làm nền
            src={product.productImage?.[0] || product.avatar || "/images/silksong_story_bg.webp"}
            alt="Story Section Background"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1d1d1dcc] to-[#262626]" />
        </div>

        {/* Foreground (SỬA TEXT) */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-10 py-10 md:py-12">
          {/* Logo (Giữ nguyên, không có trong schema) */}
          <Image
            src="/images/silksong_logo.png"
            alt="Silksong Logo"
            width={560}
            height={200}
            className="object-contain mb-6 md:mb-8"
          />

          {/* Visible story (Dùng data động) */}
          <div className="max-w-3xl space-y-4 md:space-y-5 text-sm md:text-base leading-7 md:leading-8 text-[#eaeaea]">
            {storyParagraphs.map((text: string, i: number) => (
              <p key={`base-${i}`}>{text}</p>
            ))}
          </div>

          {/* Collapsible extra story (Dùng data động) */}
          {moreStory.length > 0 && (
            <>
              <div
                className={`max-w-3xl overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
                aria-hidden={!expanded}
              >
                <div className="mt-4 md:mt-5 space-y-4 md:space-y-5 text-sm md:text-base leading-7 md:leading-8 text-[#eaeaea]">
                  {moreStory.map((text: string, i: number) => (
                    <p key={`more-${i}`}>{text}</p>
                  ))}
                </div>
              </div>

              {/* Toggle (Giữ nguyên) */}
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-6 md:mt-8 flex items-center gap-2 text-white hover:text-[#fe8c31] transition"
              >
                <span className="font-light text-sm md:text-base">
                  {expanded ? "See less" : "See more"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}