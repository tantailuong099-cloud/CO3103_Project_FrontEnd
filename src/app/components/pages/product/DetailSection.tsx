"use client";

import Image from "next/image";
import { useState } from "react";

// Helper: convert YouTube URL -> embed URL
function getYoutubeEmbedUrl(url: string): string | null {
  if (!url || url.trim() === "" || url === ",") return null; // Thêm check chuỗi rác ","
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (
      u.hostname.includes("youtube.com") ||
      u.hostname.includes("www.youtube.com")
    ) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default function DetailSection({ product }: { product: any }) {
  const [expanded, setExpanded] = useState(false);

  // Fallback images để tránh lỗi src=""
  const PLACEHOLDER = "/images/placeholder-game.png"; // Hãy đảm bảo có file này trong thư mục public
  const mainImage = product?.productImage?.[0] || PLACEHOLDER;
  const bgImage = product?.productImage?.[1] || mainImage; // Nếu không có ảnh thứ 2, dùng ảnh 1 hoặc avatar

  if (!product) {
    return (
      <section className="w-full bg-[#262626] text-white min-h-[50vh] grid place-items-center">
        <p>Loading details...</p>
      </section>
    );
  }

  type DetailRow = { label: string; value: string };
  const details: DetailRow[] = [];

  if (product.type)
    details.push({ label: "Genre", value: String(product.type) });
  if (product.language)
    details.push({ label: "Platform", value: String(product.language) });
  if (product.ageConstraints)
    details.push({ label: "ESRB", value: `Ages ${product.ageConstraints}+` });

  if (product.releaseDate) {
    const year = new Date(product.releaseDate).getFullYear();
    if (!Number.isNaN(year))
      details.push({ label: "Year Production", value: String(year) });
  }

  if (product.manufactor)
    details.push({ label: "Manufacturer", value: String(product.manufactor) });
  const players = product.playerNumber ?? product.minPlayer;
  if (players)
    details.push({ label: "Players", value: `Up to ${players} players` });
  if (product.playmode)
    details.push({
      label: "Supported play modes",
      value: String(product.playmode),
    });

  const allParagraphs = product.description
    ? product.description.split("\n").filter((p: string) => p.trim() !== "")
    : [];

  const storyParagraphs = allParagraphs.slice(0, 2);
  const moreStory = allParagraphs.slice(2);

  const embedUrl = getYoutubeEmbedUrl(product.videoLink);

  return (
    <section className="w-full bg-[#262626] text-white">
      {/* Header */}
      <div className="flex items-center bg-gradient-to-r from-[#fe8c31] to-[#f9393a] h-8 px-6 md:px-10 mb-6 rounded-sm">
        <p className="text-sm md:text-base font-bold tracking-wide">
          PRODUCT DETAILS
        </p>
      </div>
      

      {/* Trailer + Table */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 md:gap-8 px-6 md:px-10 mb-12">
        {embedUrl && (
          <div className="w-full lg:w-[480px] aspect-video rounded-md overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={product.name || "Product trailer"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-md border-0"
            />
          </div>
        )}

        {details.length > 0 && (
          <div className="w-full lg:w-[640px] border border-[#e8e7e7] rounded-md overflow-hidden">
            {details.map((d, i) => (
              <div
                key={i}
                className="flex border-b border-[#e8e7e7] last:border-b-0"
              >
                <div className="w-[220px] bg-[#1e1e1e] text-center font-semibold text-xs md:text-sm py-2.5 md:py-3 border-r border-[#e8e7e7]">
                  {d.label}
                </div>
                <div className="flex-1 text-center text-[#bababa] text-xs md:text-sm py-2.5 md:py-3 bg-[#2b2b2b]">
                  {d.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Story Section */}
      <div className="relative w-full min-h-[500px] overflow-hidden rounded-lg">
        {/* Background - FIX LỖI index [1] */}
        <div className="absolute inset-0">
          <Image
            src={bgImage} // Sử dụng biến đã xử lý fallback
            alt={`${product.name} background`}
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1d1d1dcc] to-[#262626]" />
        </div>

        {/* Foreground */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-10 py-10 md:py-12">
          {/* Logo - FIX LỖI index [0] */}
          <div className="relative w-full max-w-[560px] h-[200px] mb-6 md:mb-8">
            <Image
              src={mainImage} // Sử dụng biến đã xử lý fallback
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Story text */}
          <div className="max-w-3xl space-y-4 md:space-y-5 text-sm md:text-base leading-7 md:leading-8 text-[#eaeaea]">
            {(storyParagraphs.length > 0
              ? storyParagraphs
              : ["No description available."]
            ).map((text: string, i: number) => (
              <p key={`base-${i}`}>{text}</p>
            ))}
          </div>

          {/* Extra story */}
          {moreStory.length > 0 && (
            <>
              <div
                className={`max-w-3xl overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-4 md:mt-5 space-y-4 md:space-y-5 text-sm md:text-base leading-7 md:leading-8 text-[#eaeaea]">
                  {moreStory.map((text: string, i: number) => (
                    <p key={`more-${i}`}>{text}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setExpanded((v) => !v)}
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
                  className={`w-4 h-4 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
