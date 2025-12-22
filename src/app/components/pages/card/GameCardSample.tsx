"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatVND } from "@/app/hook/money";

export type CardProps = {
  id: string;
  title: string;
  category?: string;
  subtitle?: string;
  rating: number | string;
  price: number | string;
  avatar: string;
  tags?: string[];
};

const FALLBACK_IMAGE = "/no-image.png";

export default function CardLayout({
  id,
  title,
  category,
  rating,
  price,
  avatar,
}: CardProps) {
  const router = useRouter();

  const ratingText =
    typeof rating === "number" ? rating.toFixed(1) : String(rating);

  return (
    <div
      className="
        flex flex-col rounded-xl overflow-hidden
        bg-[#1c1c1c] border border-transparent
        shadow-[0_0_6px_rgba(0,0,0,0.4)]
        transition-colors duration-200
        hover:border-[#303030] hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]
        h-[430px]
      "
    >
      {/* Click card -> product detail */}
      <Link href={`/product/${id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative w-full h-[260px] bg-black overflow-hidden">
          <Image
            src={avatar && avatar.trim() !== "" ? avatar : FALLBACK_IMAGE}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 text-white">
          {/* Title */}
          <div className="h-[40px]">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Category + Rating */}
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs text-gray-400 truncate flex-1">{category}</p>
            <span
              className="text-xs font-semibold border border-[#fe8c31] text-[#fe8c31]
                         rounded-full px-2 py-[2px] leading-none"
              title={`${ratingText} / 10`}
            >
              {ratingText}
            </span>
          </div>

          {/* ✅ Price (VND – no discount) */}
          <div className="mt-3">
            <span className="text-[#fe8c31] text-sm font-semibold">
              {formatVND(price)}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <button
        onClick={() => router.push(`/product/${id}`)}
        className="
          mx-3 mb-3 mt-auto
          rounded-lg text-sm font-medium py-2
          bg-[#fe8c31] text-white
          transition-colors duration-200
          hover:bg-[#ff9330] active:bg-[#e77f25]
        "
      >
        Add to cart
      </button>
    </div>
  );
}
