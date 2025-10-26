"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  mainSrc: string;
  thumbs: string[];
  title: string;
};

export default function ProductGallery({ mainSrc, thumbs, title }: Props) {
  const [active, setActive] = useState(0);
  const images = thumbs.length ? thumbs : [mainSrc];

  return (
    <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#303030]">
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
        <Image
          src={images[active] || mainSrc}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            onClick={() => setActive(i)}
            className={`relative aspect-[16/10] rounded-lg overflow-hidden border transition
              ${i === active ? "border-[#fe8c31]" : "border-[#2a2a2a] hover:border-[#3a3a3a]"}`}
          >
            <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
