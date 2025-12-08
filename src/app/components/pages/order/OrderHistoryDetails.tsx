"use client";

import Image from "next/image";
import { OrderItemView } from "./order-view.type";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function OrderHistoryDetails({
  shippingAddress,
  items,
  trackingStatus, // "placed" | "processing" | "delivering" | "arrived"
}: {
  shippingAddress?: string;
  items: OrderItemView[];
  trackingStatus: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-[#1b1b1b] border border-[#2e2e2e] rounded-2xl p-4 text-[#888] text-sm">
        Loading order...
      </div>
    );
  }

  const totals = items.reduce(
    (acc, it) => {
      const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
      acc.total += finalUnit * it.quantity;
      return acc;
    },
    { total: 0 }
  );

  return (
    <div className="mt-3 bg-[#1e1e1e] border border-[#303030] rounded-xl p-4 space-y-4">
      {/* Address */}
      <div className="text-sm text-[#cdcdcd]">
        <p className="text-white font-semibold mb-1">Shipping Address</p>
        {shippingAddress ? (
          shippingAddress
        ) : (
          <span className="text-[#888]">No address provided</span>
        )}

      </div>

      {/* Tracking (very simplified) */}
      <div className="text-sm">
        <p className="text-white font-semibold mb-1">Status</p>
        <span
          className={
            trackingStatus === "delivering"
              ? "text-[#ffcf61]"
              : trackingStatus === "arrived"
              ? "text-[#7fe3a6]"
              : "text-[#fe8c31]"
          }
        >
          {trackingStatus === "placed" && "Order Placed"}
          {trackingStatus === "processing" && "Preparing Order"}
          {trackingStatus === "delivering" && "Out for Delivery"}
          {trackingStatus === "arrived" && "Delivered"}
        </span>
      </div>

      {/* Items list (condensed) */}
      <div className="space-y-3">
        {items.map((it) => {
          const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
          return (
            <div key={it.orderItemId} className="flex gap-3">
              <div className="relative w-[55px] h-[75px] overflow-hidden rounded-md shrink-0">
                <Image src={it.image} alt={it.title} fill className="object-cover" />
              </div>

              <div className="flex-1 text-sm">
                <p className="text-white font-medium line-clamp-1">{it.title}</p>
                <p className="text-[#bdbdbd]">{it.platform}</p>
                <p className="text-[#bdbdbd]">x{it.quantity}</p>
              </div>

              <div className="text-right">
                {it.discount ? (
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-[#8a8a8a] line-through text-xs">
                      {money(it.price)}
                    </span>
                    <span className="text-white text-sm font-semibold">
                      {money(finalUnit)}
                    </span>
                  </div>
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {money(it.price)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="pt-3 border-t border-[#303030] flex justify-between text-sm">
        <span className="text-[#bdbdbd]">Total</span>
        <span className="text-white font-bold text-lg">{money(totals.total)}</span>
      </div>
    </div>
  );
}
