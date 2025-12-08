"use client";

import Image from "next/image";
import { OrderItemView } from "./order-view.type";

const money = (n: number) =>
  `$${Math.max(0, n).toFixed(2).replace(/\.00$/, "")}`;

export default function OrderHistoryDetailPanel({
  orderId,
  items,
  shippingAddress,
  status,
}: {
  orderId: string;
  items: OrderItemView[];
  shippingAddress?: string;
  status:string;
}) {
  const totals = items.reduce((acc, it) => {
    const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
    return acc + finalUnit * it.quantity;
  }, 0);

  return (
    <div className="bg-[#141414] border border-[#2e2e2a] rounded-2xl p-5 w-full space-y-5">
      <h2 className="text-white text-lg font-semibold">Order Details</h2>
      <p className="text-[#bdbdbd] text-sm">Order ID: <span className="text-[#fe8c31]">{orderId}</span></p>


      {/* Shipping Address */}
      <div className="text-sm text-[#cdcdcd]">
        <p className="text-white font-semibold mb-1">Shipping Address</p>
        {shippingAddress ? (
          <span>{shippingAddress}</span>
        ) : (
          <span className="text-[#777]">No shipping address</span>
        )}
      </div>
      <div className="text-sm text-[#cdcdcd]">
        <p className="text-white font-semibold mb-1">Order Status</p>
        {status ? (
          <span>{status}</span>
        ) : (
          <span className="text-[#777]">No shipping address</span>
        )}
      </div>


      <div className="space-y-4 max-h-[60vh] overflow-auto pr-1">
        {items.map((it) => {
          const finalUnit = Math.max(0, it.price - (it.discount ?? 0));
          return (
            <div key={it.orderItemId} className="flex gap-3 items-center">
              <div className="relative w-[55px] h-[75px] rounded-md overflow-hidden shrink-0">
                <Image src={it.image} alt={it.title} fill className="object-cover" />
              </div>

              <div className="flex-1 text-sm">
                <p className="text-white line-clamp-1 font-medium">{it.title}</p>
                <p className="text-[#9d9d9d] text-xs">{it.platform} • Version {it.version}</p>
                <p className="text-[#9d9d9d] text-xs">Qty: {it.quantity}</p>
              </div>

              <p className="text-white font-semibold text-sm">{money(finalUnit * it.quantity)}</p>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#2a2a2a] flex justify-between items-center">
        <span className="text-[#bdbdbd]">Total</span>
        <span className="text-white text-xl font-bold">{money(totals)}</span>
      </div>
    </div>
  );
}
