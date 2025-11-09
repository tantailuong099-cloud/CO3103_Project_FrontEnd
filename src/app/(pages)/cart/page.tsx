"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CartItemRow, { CartItem } from "@/app/components/pages/cart/CartItem";
import CartSummary from "@/app/components/pages/cart/CartSummary";
import { api } from "@/app/services/api"; // ← dùng cùng wrapper với ProductDetail

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewFilter, setViewFilter] = useState<"All" | "Digital" | "Physical">("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // outside click cho dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // tải cart detail từ API (KHÔNG mock)
  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get<any[]>("/api/cart/detail"); // <- backend trả về mảng item
      const mapped: CartItem[] = data.map((p) => ({
        id: p._id,
        title: p.name,
        image: p.avatar,
        price: p.price,
        version: p.version,
        quantity: p.quantity,
        isDigital: p.type === "digital",
        selected: true,
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error("❌ Cart load error:", err);
      if (err.message.includes("401"))
        setError("Bạn chưa đăng nhập! Vui lòng đăng nhập để xem giỏ hàng.");
      else setError("Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  // phân loại + tổng phụ theo selection
  const digital = useMemo(() => items.filter((i) => i.isDigital), [items]);
  const physical = useMemo(() => items.filter((i) => !i.isDigital), [items]);

  const sectionSubtotal = (list: CartItem[]) =>
    list.filter((i) => i.selected).reduce((sum, i) => sum + i.price * i.quantity, 0);

  const digitalSubtotal = sectionSubtotal(digital);
  const physicalSubtotal = sectionSubtotal(physical);
  const selectedItems = items.filter(i => i.selected);

  // chọn/bỏ chọn
  const toggleItem = (id: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it)));

  const selectAll = (isDigital: boolean, value: boolean) =>
    setItems((prev) => prev.map((it) => (it.isDigital === isDigital ? { ...it, selected: value } : it)));

  const allSelected = (list: CartItem[]) => list.every((i) => i.selected) && list.length > 0;

  // PATCH /cart/update/:productId  { quantity }
  const setQty = async (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );
    try {
      await api.patch(`/api/cart/update/${id}`, { quantity: qty });
    } catch {
      setError("Cập nhật số lượng thất bại.");
      load(); // rollback
    }
  };

  // DELETE /cart/remove/:productId
  const del = async (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    try {
      await api.del(`/api/cart/remove/${id}`);
    } catch {
      setError("Xóa sản phẩm thất bại.");
      load(); // rollback
    }
  };

  return (
    <main className="min-h-screen bg-[#262626] text-white">
      {/* Header */}
      <div className="px-6 md:px-12 pt-8">
        <div className="mb-1 text-2xl font-medium">SHOPPING CART</div>
        <div className="text-[#bababa]">
          {loading ? "Loading…" : `You have ${items.length} items in your cart.`}
          {error ? <span className="ml-2 text-red-400">({error})</span> : null}
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
          {/* View Dropdown */}
          <div ref={dropdownRef} className="relative">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/90">View</span>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 bg-black px-4 py-2 rounded-[10px] text-sm hover:bg-[#1e1e1e] transition"
              >
                {viewFilter}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {dropdownOpen && (
              <div className="absolute mt-2 w-[150px] bg-[#121212] border border-gray-700 rounded-[10px] shadow-lg z-50">
                {(["All", "Digital", "Physical"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setViewFilter(opt);
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

          {/* Select Cart (select all cho cả 2 nhóm) */}
          <label className="inline-flex items-center gap-2">
            <span className="text-sm font-semibold">Select Cart</span>
            <input
              type="checkbox"
              checked={allSelected(items)}
              onChange={(e) => {
                selectAll(true, e.target.checked);
                selectAll(false, e.target.checked);
              }}
              className="size-[18px] accent-[#fe8c31]"
            />
          </label>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 md:px-12 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left */}
        <div className="flex-1 min-w-0">
          {loading && <div className="text-[#bababa]">Loading cart items…</div>}

          {!loading && (
            <>
              {/* Digital */}
              <SectionHeader
                title={`DIGITAL ITEM (${digital.length})`}
                accent
                checked={allSelected(digital)}
                onToggle={(v) => selectAll(true, v)}
              />
              <div className="mt-3 space-y-4">
                {digital.map((it) => (
                  <CartItemRow key={it.id} item={it} onToggle={toggleItem} onQty={setQty} onDelete={del} />
                ))}
                {digital.length === 0 && <EmptyHint text="No digital items." />}
              </div>

              {/* Physical */}
              <SectionHeader
                className="mt-10"
                title={`PHYSICAL ITEM (${items.filter((i) => !i.isDigital).length})`}
                checked={allSelected(items.filter((i) => !i.isDigital))}
                onToggle={(v) => selectAll(false, v)}
              />
              <div className="mt-3 space-y-4">
                {items
                  .filter((i) => !i.isDigital)
                  .map((it) => (
                    <CartItemRow key={it.id} item={it} onToggle={toggleItem} onQty={setQty} onDelete={del} />
                  ))}
                {items.filter((i) => !i.isDigital).length === 0 && <EmptyHint text="No physical items." />}
              </div>
            </>
          )}
        </div>

        {/* Right summary */}

        <CartSummary digitalSubtotal={digitalSubtotal} physicalSubtotal={physicalSubtotal} selectedItems={selectedItems}/>
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
      <h3 className={`text-2xl font-semibold ${accent ? "text-[#fe8c31]" : "text-white"}`}>{title}</h3>
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

function EmptyHint({ text }: { text: string }) {
  return <div className="text-[#9a9a9a] text-sm">{text}</div>;
}
