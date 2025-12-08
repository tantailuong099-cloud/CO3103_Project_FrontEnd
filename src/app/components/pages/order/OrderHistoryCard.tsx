"use client";

import Image from "next/image";
import { OrderItemView } from "./order-view.type";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export type OrderHistoryCardProps = {
  orderId: string;
  date: string;                 // e.g. "14 May, 2025"
  items: OrderItemView[];  
  status: string;     // list of items in this order
  onSelect?: (orderId: string) => void; // ← add this
};

export default function OrderHistoryCard({
  orderId,
  date,
  items,
  status,
  onSelect,           // ← destructure it
}: OrderHistoryCardProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#1b1b1b] border border-[#2e2e2e] rounded-2xl p-4 text-[#888] text-sm">
        Loading order...
      </div>
    );
  }
const statusLabelMap: Record<string, string> = {
  pending: "Pending Payment",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusLabel = statusLabelMap[status] ?? status;


  const first = items[0];

  const totals = items.reduce(
    (acc, it) => {
      const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
      acc.total += finalUnit * it.quantity;
      return acc;
    },
    { total: 0 }
  );

  const finalUnit = Math.max(0, first.price - (first.discount ?? 0));
  return (
    <div className="bg-[#1b1b1b] border border-[#2e2e2e] rounded-2xl p-4 flex flex-col gap-2">
      {/* Top */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#bdbdbd]">
          Order ID: <span className="text-[#fe8c31] font-medium">{orderId}</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#bababa]">{date}</span>
        </div>
      </div>

      {/* Middle */}
      <div className="flex gap-4">
        <div className="relative w-[80px] h-[120px] rounded-md overflow-hidden shrink-0">
          <Image src={first.image} alt={first.title} fill className="object-cover" />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-white text-base font-semibold line-clamp-2">{first.title}</p>
            <p className="text-[#cdcdcd] text-sm mt-1">{first.platform}</p>
            <p className="text-[#cdcdcd] text-sm">Version {first.version}</p>
            <p className="text-[#cdcdcd] text-sm">x{first.quantity}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-between items-end shrink-0">
          <div className="flex items-center gap-2 mt-2">
            {first.discount ? (
              <>
                <span className="text-[#8a8a8a] line-through text-sm">{money(first.price)}</span>
                <span className="text-white text-base font-medium">{money(finalUnit)}</span>
              </>
            ) : (
              <span className="text-white text-base font-medium">{money(first.price)}</span>
            )}
          </div>

          <button
            onClick={() => onSelect?.(orderId)}   // ← use it safely
            className="text-xs text-[#bdbdbd] hover:text-white transition"
          >
            View Details →
          </button>
        </div>
      </div>

      {/* Bottom row */}
      <div className="h-fit flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <button className="text-xs px-3 py-2 rounded-lg border border-[#3a3a3a] text-[#dedddd] hover:border-[#fe8c31] transition">
            Rating Now
          </button>
          <button className="text-xs px-3 py-2 rounded-lg bg-[#2e2e2e] text-white hover:bg-[#3a3a3a] transition">
            {statusLabel}
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[#bdbdbd] text-sm">Order Total:</span>
          <span className="text-white text-lg font-bold">{money(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}
