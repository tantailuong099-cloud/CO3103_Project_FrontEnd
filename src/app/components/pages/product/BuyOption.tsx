"use client";

import RatingStars from "./RatingStars";
import { useState } from "react";

type ProductLike = {
  title: string;
  genre?: string[];
  subtitle?: string;
  image: string;
  price: number | string;
  discount?: number | string | null; // numeric discount (amount off)
  rating: number | string;
};

const toNum = (v: number | string | null | undefined) =>
  v == null ? NaN : parseFloat(String(v).replace(/[^0-9.]/g, ""));
const fmt = (n: number) => `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function BuyOption({ product }: { product: ProductLike }) {
  const { title, genre = [], price, discount = null, rating } = product;

  const base = toNum(price);
  const off = toNum(discount);
  const hasDiscount = Number.isFinite(base) && Number.isFinite(off) && off > 0 && off < base;
  const finalPrice = hasDiscount ? base - off : base;

  const [qty, setQty] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const versions = ["Version 2023", "Version Halloween", "Version Lite"];
  const platforms = ["Nintendo Switch 2", "PS5", "XBOX"];

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAddToCart = () => {
    if (!selectedVersion || !selectedPlatform) {
      alert("Please select a version and platform before adding to cart!");
      return;
    }
    console.log("Added to cart:", {
      productId: product.title,
      version: selectedVersion,
      platform: selectedPlatform,
      qty,
      price: finalPrice,
    });
  };

  return (
    <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#303030] lg:sticky lg:top-6">
      {/* Title */}
      <h2 className="text-lg font-semibold">{title}</h2>

      {/* Chips row: year / state / metas */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Chip text="2023" />
        <Chip text="E10+" color="accent" />
        <OutlineChip label="Metacritic:" value="8.8" />
        <OutlineChip label="IGN:" value="9.6" />
      </div>

      {/* Rating group */}
      <div className="mt-4 flex items-center gap-5">
        <RatingStars rating={rating} reviews={288} />
        <div className="h-4 w-px bg-gray-600" />
        <button className="text-[#bababa] text-sm hover:text-white transition">View ratings</button>
      </div>

      {/* Genre */}
      <Row label="Genre">
        <span className="text-white text-sm">{genre.join(", ") || "—"}</span>
      </Row>

      {/* Type */}
      <Row label="Type">
        <Pill>Digital</Pill>
      </Row>

      {/* Option Selector */}
      <Row label="Option">
        <div className="flex flex-wrap gap-2">
          {versions.map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVersion(v)}
              className={`px-3 py-1 rounded-[12px] text-sm transition-colors duration-200 ${
                selectedVersion === v
                  ? "bg-[#fe8c31] text-white"
                  : "bg-[#666666] text-white hover:bg-[#777]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </Row>

      {/* Platform Selector */}
      <Row label="Platform">
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1 rounded-[12px] text-sm transition-colors duration-200 ${
                selectedPlatform === p
                  ? "bg-[#fe8c31] text-white"
                  : "bg-[#666666] text-white hover:bg-[#777]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </Row>

      {/* Price */}
      <div className="mt-6 flex items-end gap-3">
        {hasDiscount ? (
          <>
            <span className="text-gray-400 line-through text-lg">{fmt(base)}</span>
            <span className="text-white text-2xl font-semibold">{fmt(finalPrice)}</span>
            <span className="ml-1 text-xs font-semibold bg-[#fa4d38] text-white rounded px-2 py-[2px]">
              -{fmt(off)}
            </span>
          </>
        ) : (
          <span className="text-white text-2xl font-semibold">
            {Number.isFinite(base) ? fmt(base) : String(price)}
          </span>
        )}
      </div>

      {/* Quantity + CTA */}
      <div className="mt-5 flex items-center gap-4">
        <Qty dec={dec} inc={inc} qty={qty} />
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#fe8c31] hover:bg-[#ff9330] text-white py-3 rounded-lg font-semibold transition"
        >
          Add to Cart
        </button>
      </div>

      {/* Small info */}
      <ul className="mt-5 text-sm text-gray-300 space-y-1">
        <li>• Instant delivery</li>
        <li>• Region free</li>
        <li>• Refund policy applies</li>
      </ul>

      {/* Show selected values */}
      {(selectedVersion || selectedPlatform) && (
        <p className="mt-3 text-sm text-gray-400">
          {selectedVersion && (
            <>
              Version: <span className="text-white">{selectedVersion}</span>{" "}
            </>
          )}
          {selectedPlatform && (
            <>
              Platform: <span className="text-white">{selectedPlatform}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-4">
      <p className="text-[#bababa] text-sm w-[100px] shrink-0">{label}</p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Chip({ text, color = "default" }: { text: string; color?: "default" | "accent" }) {
  const cls = color === "accent" ? "bg-[#fa4d38] text-white" : "bg-black text-white";
  return <span className={`px-3 py-1 rounded-[15px] text-sm ${cls}`}>{text}</span>;
}

function OutlineChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="px-3 py-1 rounded-[15px] text-sm border-2 border-[#fe8c31] text-[#fe8c31]">
      <span className="font-semibold">{label}</span> {value}
    </span>
  );
}

function Pill({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-[12px] text-sm ${
        muted ? "bg-[#666666] text-white" : "bg-[#2b2b2b] text-gray-200"
      }`}
    >
      {children}
    </span>
  );
}

function Qty({ qty, dec, inc }: { qty: number; dec: () => void; inc: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={dec}
        className="w-10 h-10 rounded-lg border border-[#3a3a3a] text-white hover:bg-[#242424] transition"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <div className="w-12 h-10 rounded-lg bg-white text-black grid place-items-center font-medium select-none">
        {qty}
      </div>
      <button
        onClick={inc}
        className="w-10 h-10 rounded-lg border border-[#3a3a3a] text-white hover:bg-[#242424] transition"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
