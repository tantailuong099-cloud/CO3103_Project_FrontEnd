"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import CartItemRow, { CartItem } from "@/app/components/pages/cart/CartItem";
import CartSummary from "@/app/components/pages/cart/CartSummary";

// deterministic PRNG like the rest of your project (mulberry32)
function rng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const platforms = ["PS5", "Nintendo Switch 2", "XBOX", "PC"] as const;
const versions = ["Version 2025", "Version 2023", "Version Lite", "Halloween"];

function makeMockCart(seed = 42) {
  const rand = rng(seed);
  const items: CartItem[] = [];

  // 6 digital + 5 physical
  const totalDigital = 6;
  const totalPhysical = 5;

  const makeOne = (i: number, isDigital: boolean): CartItem => {
    const title = `Elden Ring: Shadow of the Erdtree ${i + 1}`;
    const price = Math.floor(rand() * 40) + 20;
    const hasDiscount = rand() > 0.5;
    const discount = hasDiscount ? Math.floor(rand() * 6) + 2 : null;
    const quantity = 1 + Math.floor(rand() * 3);
    const platform = platforms[Math.floor(rand() * platforms.length)];
    const version = versions[Math.floor(rand() * versions.length)];

    return {
      id: i + 1 + (isDigital ? 0 : 1000),
      title,
      image: "/images/EldenRing_poster.jpg",
      platform,
      version,
      price,
      discount,
      quantity,
      isDigital,
      selected: true,
    };
  };

  for (let i = 0; i < totalDigital; i++) items.push(makeOne(i, true));
  for (let i = 0; i < totalPhysical; i++) items.push(makeOne(i, false));

  return items;
}

export default function CartPage() {
  const initial = useMemo(() => makeMockCart(77), []);
  const [items, setItems] = useState<CartItem[]>(initial);
  const [viewFilter, setViewFilter] = useState<"All" | "Digital" | "Physical">("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const digital = items.filter((i) => i.isDigital);
  const physical = items.filter((i) => !i.isDigital);

  const filteredItems =
    viewFilter === "All"
      ? items
      : viewFilter === "Digital"
      ? digital
      : physical;

  const sectionSubtotal = (list: CartItem[]) =>
    list
      .filter((i) => i.selected)
      .reduce(
        (sum, i) => sum + Math.max(0, i.price - (i.discount ?? 0)) * i.quantity,
        0
      );

  const digitalSubtotal = sectionSubtotal(digital);
  const physicalSubtotal = sectionSubtotal(physical);

  const toggleItem = (id: number) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it))
    );

  const setQty = (id: number, qty: number) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it)));

  const del = (id: number) => setItems((prev) => prev.filter((it) => it.id !== id));

  const selectAll = (isDigital: boolean, value: boolean) =>
    setItems((prev) =>
      prev.map((it) => (it.isDigital === isDigital ? { ...it, selected: value } : it))
    );

  const allSelected = (list: CartItem[]) => list.every((i) => i.selected) && list.length > 0;

  return (
    <main className="min-h-screen bg-[#262626] text-white">
      {/* Header */}
      <div className="px-6 md:px-12 pt-8">
        <div className="mb-1 text-2xl font-medium">SHOPPING CART</div>
        <div className="text-[#bababa]">You have {items.length} items in your cart.</div>

        {/* Filter bar */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
          {/* View Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/90">View</span>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-black px-4 py-2 rounded-[10px] text-sm hover:bg-[#1e1e1e] transition"
              >
                {viewFilter}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {dropdownOpen && (
              <div className="absolute mt-2 w-[150px] bg-[#121212] border border-gray-700 rounded-[10px] shadow-lg z-50">
                {["All", "Digital", "Physical"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setViewFilter(opt as any);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[14px] rounded-[10px] transition-colors ${
                      viewFilter === opt
                        ? "bg-[#fa4d38] text-white"
                        : "text-[#bababa] hover:bg-[#1e1e1e] hover:text-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Cart */}
          <label className="inline-flex items-center gap-2">
            <span className="text-sm font-semibold">Select Cart</span>
            <input
              type="checkbox"
              checked={allSelected(items)}
              onChange={(e) =>
                selectAll(true, e.target.checked) || selectAll(false, e.target.checked)
              }
              className="size-[18px] accent-[#fe8c31]"
            />
          </label>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 md:px-12 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left */}
        <div className="flex-1 min-w-0">
          {viewFilter === "All" && (
            <>
              <SectionHeader
                title={`DIGITAL ITEM (${digital.length})`}
                accent
                checked={allSelected(digital)}
                onToggle={(v) => selectAll(true, v)}
              />
              <div className="mt-3 space-y-4">
                {digital.map((it) => (
                  <CartItemRow
                    key={it.id}
                    item={it}
                    onToggle={toggleItem}
                    onQty={setQty}
                    onDelete={del}
                  />
                ))}
              </div>

              <SectionHeader
                className="mt-10"
                title={`PHYSICAL ITEM (${physical.length})`}
                checked={allSelected(physical)}
                onToggle={(v) => selectAll(false, v)}
              />
              <div className="mt-3 space-y-4">
                {physical.map((it) => (
                  <CartItemRow
                    key={it.id}
                    item={it}
                    onToggle={toggleItem}
                    onQty={setQty}
                    onDelete={del}
                  />
                ))}
              </div>
            </>
          )}

          {viewFilter === "Digital" && (
            <>
              <SectionHeader
                title={`DIGITAL ITEM (${digital.length})`}
                accent
                checked={allSelected(digital)}
                onToggle={(v) => selectAll(true, v)}
              />
              <div className="mt-3 space-y-4">
                {digital.map((it) => (
                  <CartItemRow
                    key={it.id}
                    item={it}
                    onToggle={toggleItem}
                    onQty={setQty}
                    onDelete={del}
                  />
                ))}
              </div>
            </>
          )}

          {viewFilter === "Physical" && (
            <>
              <SectionHeader
                title={`PHYSICAL ITEM (${physical.length})`}
                accent
                checked={allSelected(physical)}
                onToggle={(v) => selectAll(false, v)}
              />
              <div className="mt-3 space-y-4">
                {physical.map((it) => (
                  <CartItemRow
                    key={it.id}
                    item={it}
                    onToggle={toggleItem}
                    onQty={setQty}
                    onDelete={del}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right summary */}
        <CartSummary
          digitalSubtotal={digitalSubtotal}
          physicalSubtotal={physicalSubtotal}
        />
      </div>
    </main>
  );
}

/* ---------- small bits ---------- */
function SectionHeader({
  title,
  checked,
  onToggle,
  accent = false,
  className = "",
}: {
  title: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h3
        className={`text-2xl font-semibold ${
          accent ? "text-[#fe8c31]" : "text-white"
        }`}
      >
        {title}
      </h3>
      <label className="inline-flex items-center gap-2">
        <span className="text-sm font-semibold">Select All</span>
        <input
          type="checkbox"
          className="size-[18px] accent-[#fe8c31]"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
      </label>
    </div>
  );
}
