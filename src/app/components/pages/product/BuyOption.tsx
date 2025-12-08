"use client";

import RatingStars from "./RatingStars";
import { useState } from "react";
import { api } from "@/app/services/api";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/services/auth";

const toNum = (v: number | string | null | undefined) =>
  v == null ? NaN : parseFloat(String(v).replace(/[^0-9.]/g, ""));
const fmt = (n: number) => `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function BuyOption({ product }: { product: any }) {
  const router = useRouter(); 
  const {
    _id,
    name,
    type,
    price,
    version,
    categoryName,        // string: "action"
    metacriticScore,
    ignScore,
    releaseDate,
    ageConstraints,
    productImage = [],
    avatar,
    language,        // language = platform
    videoLink
  } = product;

  const base = toNum(price);
  const finalPrice = base;

  const [qty, setQty] = useState(1);

  // Platform list từ language (nếu muốn show)
  const platforms = language
    ? language.split(",").map((p: string) => p.trim())
    : [];

  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAddToCart = async () => {
  try {
    await getMe();

    const res= await api.post(
      "/api/cart/add",
      {
        productId: _id,
        quantity: qty,
      }
    );
    console.log("🛒 Cart sau khi thêm:", res);

    alert("✅ Added to cart!");
  } catch (err) {
    console.error(err);

    router.push("/login");
  }
  };

  return (
    <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#303030] lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold">{name}</h2>

      {/* Chips */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Chip text={String(year)} />
        <Chip
          text={ageConstraints ? `Ages ${ageConstraints}+` : "Not Rated"}
          color="accent"
        />
        <OutlineChip
          label="Metacritic:"
          value={metacriticScore ? metacriticScore.toFixed(1) : "N/A"}
        />
        <OutlineChip
          label="IGN:"
          value={ignScore ? ignScore.toFixed(1) : "N/A"}
        />
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-5">
        <RatingStars rating={metacriticScore} reviews={288} />
        <div className="h-4 w-px bg-gray-600" />
        <button className="text-[#bababa] text-sm hover:text-white transition">
          View ratings
        </button>
      </div>

      {/* Genre */}
      <Row label="Genre">
        <span className="text-white text-sm capitalize">{categoryName}</span>
      </Row>

      {/* Type */}
      <Row label="Type">
        <Pill>{type}</Pill>
      </Row>

      {/* Version (chỉ hiển thị) */}
      {version && (
        <Row label="Version">
          <span className="text-white text-sm">{version}</span>
        </Row>
      )}

      {/* Platform = language (hiển thị text/pill, không chọn nữa) */}
      {platforms.length > 0 && (
        <Row label="Platform">
          <div className="flex flex-wrap gap-2">
            {platforms.map((p: string) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </Row>
      )}

      {/* PRICE */}
      <div className="mt-6 flex items-end gap-3">
        <p className="text-2xl font-bold text-white">{fmt(finalPrice)}</p>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="mt-6 flex items-center gap-4">
        <Qty qty={qty} dec={dec} inc={inc} />
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#fe8c31] hover:bg-[#ff9d4c] text-black font-semibold py-3 rounded-lg transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ---------- UI Subcomponents ---------- */

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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-[12px] text-sm bg-[#2b2b2b] text-gray-200">
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
      >
        −
      </button>
      <div className="w-12 h-10 rounded-lg bg-white text-black grid place-items-center font-medium select-none">
        {qty}
      </div>
      <button
        onClick={inc}
        className="w-10 h-10 rounded-lg border border-[#3a3a3a] text-white hover:bg-[#242424] transition"
      >
        +
      </button>
    </div>
  );
}
